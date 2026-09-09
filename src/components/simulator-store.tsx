"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  calculatePayment,
  type Frequency,
  type Simulation,
} from "@/lib/credit";
import { config } from "@/lib/config";
import {
  loadRatesConfig,
  type RuntimeRatesConfig,
} from "@/lib/rates-config";

/**
 * Shared simulator store (ported from the prototype's window.Plataxi bridge).
 * `useSimulator()` is the single source of truth read by the Simulator island,
 * the sticky payment bar, the apply modal (which freezes a snapshot on open),
 * the resume nudge, and the WhatsApp links.
 *
 * All numeric params come from config (env-driven).
 */

const STATIC_RATES: RuntimeRatesConfig = {
  monthlyRate: config.credit.monthlyRate,
  amountMin: config.simulator.amountMin,
  amountMax: config.simulator.amountMax,
  termOptions: config.simulator.termOptions,
  offeredFrequencies: config.simulator.offeredFrequencies as unknown as string[],
};

export const clampAmount = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const clampRoundAmount = (
  v: number,
  min: number,
  max: number,
  step: number,
): number => clampAmount(Math.round(v / step) * step, min, max);

interface SimulatorStore {
  amount: number;
  term: number;
  frequency: Frequency;
  sim: Simulation;
  amountMin: number;
  amountMax: number;
  amountStep: number;
  amountStepBig: number;
  termOptions: number[];
  offeredFrequencies: string[];
  /** Clamp to [MIN,MAX]; `round` also snaps to AMOUNT_STEP (slider/stepper/blur). */
  setAmount: (value: number, round?: boolean) => void;
  setTerm: (term: number) => void;
  setFrequency: (frequency: Frequency) => void;
}

const SimulatorContext = createContext<SimulatorStore | null>(null);

export function SimulatorProvider({
  children,
  initialRates,
}: {
  children: React.ReactNode;
  initialRates?: RuntimeRatesConfig;
}) {
  const [rates, setRates] = useState<RuntimeRatesConfig>(
    initialRates ?? STATIC_RATES,
  );
  // Ref para evitar cierre stale en setAmount cuando loadRatesConfig resuelve async
  const ratesRef = useRef(rates);
  useEffect(() => {
    ratesRef.current = rates;
  }, [rates]);

  // El servidor (RSC) siembra los rates iniciales: el monto/plazo por defecto se
  // ajusta al rango servido para que el primer paint ya muestre valores válidos.
  const [amount, setAmountState] = useState(() =>
    clampRoundAmount(
      config.simulator.defaultAmount,
      rates.amountMin,
      rates.amountMax,
      config.simulator.amountStep,
    ),
  );
  const [term, setTerm] = useState(() => {
    const d = config.simulator.defaultTerm;
    const a = config.simulator.defaultAmount;
    if (a <= rates.amountMin && d !== 1) return 1;
    if (a > config.credit.highAmountThreshold && d < config.credit.highAmountMinTerm)
      return config.credit.highAmountMinTerm;
    return rates.termOptions.includes(d) ? d : rates.termOptions[0];
  });
  const [frequency, setFrequency] = useState<Frequency>(() => {
    const preferred = "monthly";
    return (rates.offeredFrequencies as string[]).includes(preferred)
      ? preferred
      : (rates.offeredFrequencies[0] as Frequency) ?? preferred;
  });

  // Auto-corrige la frecuencia si ya no está en la lista ofrecida
  useEffect(() => {
    if (!rates.offeredFrequencies.includes(frequency)) {
      setFrequency((rates.offeredFrequencies[0] as Frequency) ?? "monthly");
    }
  }, [rates.offeredFrequencies, frequency]);

  // Auto-corrige el plazo cuando el monto entra en rangos con plazo único
  useEffect(() => {
    if (amount <= rates.amountMin && term !== 1) {
      setTerm(1);
      return;
    }
    if (amount > config.credit.highAmountThreshold && term < config.credit.highAmountMinTerm) {
      setTerm(config.credit.highAmountMinTerm);
    }
  }, [amount, rates.amountMin, term]);

  const setAmount = useCallback(
    (value: number, round = true) => {
      const { amountMin, amountMax } = ratesRef.current;
      setAmountState(
        round
          ? clampRoundAmount(value, amountMin, amountMax, config.simulator.amountStep)
          : clampAmount(value, amountMin, amountMax),
      );
    },
    [],
  );

  // Respaldo client-side: si el servidor (RSC) ya sembró rates en vivo se
  // respeta. Solo refresca cuando el servidor no pudo leer Core, y en ese caso
  // los rates de Core (tasa, montos y plazos) se respetan tal cual.
  useEffect(() => {
    if (initialRates) return;
    let active = true;
    void loadRatesConfig('/api/rates-config').then((nextRates) => {
      if (!active || nextRates === null) return;
      // Core es la fuente de verdad para tasa, montos y plazos: se respeta tal cual.
      const safeRates: RuntimeRatesConfig = { ...nextRates };
      setRates(safeRates);
      setAmountState((current) =>
        clampRoundAmount(
          current,
          safeRates.amountMin,
          safeRates.amountMax,
          config.simulator.amountStep,
        ),
      );
      // term 3 is in [1,2,3], so no jump
      setTerm((current) =>
        safeRates.termOptions.includes(current) ? current : safeRates.termOptions[0],
      );
    });
    return () => {
      active = false;
    };
  }, [initialRates]);

  // Settle the amount before deriving sim. Dragging the slider fires every ~15ms;
  // rendering every change (~90/sec) reads as an odometer not a calculation.
  // Debounce to a calm settled value used for all downstream displays (payment,
  // total cost, validity, sticky bar, etc.) — keeps them all consistent and
  // responsive, not rolling.
  const [settledAmount, setSettledAmount] = useState(() =>
    clampRoundAmount(
      config.simulator.defaultAmount,
      rates.amountMin,
      rates.amountMax,
      config.simulator.amountStep,
    ),
  );
  useEffect(() => {
    const t = setTimeout(() => setSettledAmount(amount), 150);
    return () => clearTimeout(t);
  }, [amount]);

  const sim = useMemo(
    () => calculatePayment(settledAmount, term, frequency, rates.monthlyRate),
    [settledAmount, term, frequency, rates.monthlyRate],
  );

  const value = useMemo<SimulatorStore>(
    () => ({
      amount,
      term,
      frequency,
      sim,
      amountMin: rates.amountMin,
      amountMax: rates.amountMax,
      amountStep: config.simulator.amountStep,
      amountStepBig: config.simulator.amountStepBig,
      termOptions: rates.termOptions,
      offeredFrequencies: rates.offeredFrequencies,
      setAmount,
      setTerm,
      setFrequency,
    }),
    [amount, term, frequency, sim, rates, setAmount],
  );

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator(): SimulatorStore {
  const ctx = useContext(SimulatorContext);
  if (!ctx)
    throw new Error("useSimulator must be used within <SimulatorProvider>");
  return ctx;
}

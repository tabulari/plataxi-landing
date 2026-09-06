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

  const [amount, setAmountState] = useState(config.simulator.defaultAmount);
  const [term, setTerm] = useState(() => {
    const d = config.simulator.defaultTerm;
    const a = config.simulator.defaultAmount;
    if (a <= config.simulator.amountMin && d !== 1) return 1;
    if (a > config.credit.highAmountThreshold && d < config.credit.highAmountMinTerm)
      return config.credit.highAmountMinTerm;
    return d;
  });
  const [frequency, setFrequency] = useState<Frequency>("monthly");

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

  useEffect(() => {
    let active = true;
    void loadRatesConfig('/api/rates-config').then((nextRates) => {
      if (!active || nextRates === null) return;
      // Keep termOptions static [1,2,3,4,5,6] (max 6) — live Core still returns [3,6,9,12,18,24] and would flicker 6→2 chips
      // Clamp amountMin to at least the landing's configured floor (100k) until Core updates its min_amount
      const safeRates: RuntimeRatesConfig = {
        ...nextRates,
        amountMin: Math.max(nextRates.amountMin, STATIC_RATES.amountMin),
        termOptions: STATIC_RATES.termOptions,
      };
      setRates(safeRates);
      setAmountState((current) =>
        clampRoundAmount(
          current,
          safeRates.amountMin,
          safeRates.amountMax,
          config.simulator.amountStep,
        ),
      );
      // term 3 is in [1-6], so no jump (was 6→24 before cap, now 6→2 before fix)
      setTerm((current) =>
        safeRates.termOptions.includes(current) ? current : safeRates.termOptions[0],
      );
    });
    return () => {
      active = false;
    };
  }, []);

  // Settle the amount before deriving sim. Dragging the slider fires every ~15ms;
  // rendering every change (~90/sec) reads as an odometer not a calculation.
  // Debounce to a calm settled value used for all downstream displays (payment,
  // total cost, validity, sticky bar, etc.) — keeps them all consistent and
  // responsive, not rolling.
  const [settledAmount, setSettledAmount] = useState(config.simulator.defaultAmount);
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

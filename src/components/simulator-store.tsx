"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
 * Shared simulator store (ported from the prototype's window.Credalia bridge).
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

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<RuntimeRatesConfig>(STATIC_RATES);
  const [amount, setAmountState] = useState(config.simulator.defaultAmount);
  const [term, setTerm] = useState(config.simulator.defaultTerm);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const setAmount = useCallback(
    (value: number, round = true) => {
      setAmountState(
        round
          ? clampRoundAmount(
              value,
              rates.amountMin,
              rates.amountMax,
              config.simulator.amountStep,
            )
          : clampAmount(value, rates.amountMin, rates.amountMax),
      );
    },
    [rates.amountMax, rates.amountMin],
  );

  useEffect(() => {
    let active = true;
    void loadRatesConfig('/api/rates-config').then((nextRates) => {
      if (!active || nextRates === null) return;
      setRates(nextRates);
      setAmountState((current) =>
        clampRoundAmount(
          current,
          nextRates.amountMin,
          nextRates.amountMax,
          config.simulator.amountStep,
        ),
      );
      setTerm((current) =>
        nextRates.termOptions.includes(current)
          ? current
          : nextRates.termOptions[0],
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

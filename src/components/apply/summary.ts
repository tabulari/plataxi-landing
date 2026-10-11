import { config } from '@/lib/config';
import { fmtCOP, fmtPct, type Simulation } from '@/lib/credit';
import { capFreq } from './use-application-form';

/**
 * Single source of truth for the application breakdown ("tu solicitud").
 *
 * The simulator's step 3 and the apply modal's sidebar read their rows from
 * here, so the two surfaces cannot drift apart: same labels, same order, same
 * numbers. Presentation is owned by each surface (the simulator renders them on
 * white, the sidebar on dark), but the data is derived exactly once.
 *
 * The rates and fee amounts are taken from the Simulation itself whenever it
 * carries them, falling back to the static config literals for snapshots taken
 * before Core started serving dynamic rates — the same ?? chain the sidebar
 * used before this module existed.
 */

export interface SummaryRow {
  label: string;
  value: string;
}

export interface SummaryBreakdown {
  /** The cuota, formatted the way both surfaces head their panel. */
  payment: string;
  unit: string;
  rows: SummaryRow[];
  note: string;
}

export function summaryBreakdown(sim: Simulation): SummaryBreakdown {
  const monthlyRate = sim.monthlyRate ?? config.credit.monthlyRate;
  const platformRate = sim.platformFeeRate ?? config.credit.platformFeeRate;
  const guaranteeRate = sim.guaranteeFeeRate ?? config.credit.guaranteeFeeRate;
  const legalInterest = sim.legalInterestAmount ?? Math.round(sim.amount * monthlyRate * sim.term);
  const platformFee = sim.platformFeeAmount ?? 0;
  const guaranteeFee = sim.guaranteeFeeAmount ?? 0;

  const rows: SummaryRow[] = [
    { label: 'Capital', value: `$${fmtCOP(sim.amount)}` },
    { label: 'Plazo', value: `${sim.term} ${sim.term === 1 ? 'mes' : 'meses'}` },
    { label: 'Forma de pago', value: capFreq(sim.frequency) },
    { label: 'Nº pagos', value: `${Math.round(sim.nPeriods)} cuotas` },
    { label: `Interés Legal (${fmtPct(monthlyRate * sim.term, 1)}%)`, value: `$${fmtCOP(legalInterest)}` },
  ];

  // Optional services are opt-in, so they only appear when they actually charge.
  if (platformFee > 0) {
    rows.push({ label: `Plataforma (${fmtPct(platformRate, 1)}%)`, value: `$${fmtCOP(platformFee)}` });
  }
  if (guaranteeFee > 0) {
    rows.push({ label: `Fianza (${fmtPct(guaranteeRate, 1)}%)`, value: `$${fmtCOP(guaranteeFee)}` });
  }

  return {
    payment: `$${fmtCOP(sim.payment)}`,
    unit: sim.unit,
    rows,
    note: sim.isEstimate
      ? 'Cuota estimada. Cargo definitivo se confirma en la oferta.'
      : 'Sujeto a verificación. La aprobación se confirma en la oferta.',
  };
}

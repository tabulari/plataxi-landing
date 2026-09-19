import { ClockIcon, SearchCheckIcon, ShieldCheckIcon, AlertCircleIcon } from '../icons';

export interface TriageMetrics {
  expiredSlaCount: number;
  pendingKycCount: number;
  unverifiedDisbursementsCount: number;
}

interface TriageCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: 'critical' | 'warning' | 'info';
  onClick: () => void;
}

function TriageCard({ label, count, icon, tone, onClick }: TriageCardProps) {
  const tones = {
    critical: 'bg-[#c0253b]/10 border-[#c0253b]/40 text-[#c0253b]',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${tones[tone]}`}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/70 shrink-0">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-extrabold uppercase tracking-wider opacity-80">
          {label}
        </span>
        <span className="block text-xl font-extrabold tabular-nums leading-tight">
          {count}
        </span>
      </span>
    </button>
  );
}

export function TriageBanner({ metrics, onSelectFilter }: { metrics: TriageMetrics; onSelectFilter: () => void }) {
  const critical = metrics.expiredSlaCount;
  const pending = metrics.pendingKycCount;
  const unverified = metrics.unverifiedDisbursementsCount;

  return (
    <section aria-label="Prioridades de atención" className="rounded-2xl border border-border bg-bg-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircleIcon size={20} className="text-navy" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy">
          Prioridades de atención
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TriageCard
          label="SLA Expirados"
          count={critical}
          tone="critical"
          icon={<ClockIcon size={18} className="text-[#c0253b]" />}
          onClick={onSelectFilter}
        />
        <TriageCard
          label="KYC Pendiente"
          count={pending}
          tone="warning"
          icon={<SearchCheckIcon size={18} className="text-amber-800" />}
          onClick={onSelectFilter}
        />
        <TriageCard
          label="Desembolsos por Verificar"
          count={unverified}
          tone="info"
          icon={<ShieldCheckIcon size={18} className="text-blue-800" />}
          onClick={onSelectFilter}
        />
      </div>
    </section>
  );
}
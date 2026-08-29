'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TriageBanner, type TriageMetrics } from '@/components/backoffice/TriageBanner';
import { ApplicationsTable, type BackofficeApplication } from '@/components/backoffice/ApplicationsTable';
import { SplitPaneKycDesk } from '@/components/backoffice/SplitPaneKycDesk';
import { DisbursementDesk } from '@/components/backoffice/DisbursementDesk';
import { AuditLogModal, type AuditEntry } from '@/components/backoffice/AuditLogModal';
import { ShieldCheckIcon, ReturnArrowIcon } from '@/components/icons';

const INITIAL_APPLICATIONS: BackofficeApplication[] = [
  {
    radicado: 'CR-2026-009182',
    applicantName: 'Laura Martínez Gómez',
    idNumber: '1.024.567.890',
    phone: '300 123 4567',
    amount: 500000,
    termMonths: 12,
    bankName: 'Bancolombia',
    status: 'needs_review',
    livenessScore: 98.4,
    ocrMatchPct: 96.2,
    createdAt: '2026-08-14 09:30',
    hoursStale: 5,
  },
  {
    radicado: 'CR-2026-009140',
    applicantName: 'Carlos Eduardo Restrepo',
    idNumber: '1.098.234.112',
    phone: '315 987 6543',
    amount: 1000000,
    termMonths: 18,
    bankName: 'Davivienda',
    status: 'needs_review',
    livenessScore: 91.0,
    ocrMatchPct: 88.5,
    createdAt: '2026-08-12 14:15',
    hoursStale: 28, // Expired SLA >24h
  },
  {
    radicado: 'CR-2026-009110',
    applicantName: 'Ana María Betancur',
    idNumber: '1.017.345.990',
    phone: '320 456 7890',
    amount: 300000,
    termMonths: 6,
    bankName: 'Nequi',
    status: 'verified',
    livenessScore: 99.1,
    ocrMatchPct: 98.0,
    createdAt: '2026-08-14 11:00',
    hoursStale: 2,
  },
  {
    radicado: 'CR-2026-008990',
    applicantName: 'Jorge Ignacio Silva',
    idNumber: '1.032.111.456',
    phone: '301 765 4321',
    amount: 800000,
    termMonths: 12,
    bankName: 'Banco de Bogotá',
    status: 'disbursed',
    livenessScore: 97.5,
    ocrMatchPct: 95.0,
    createdAt: '2026-08-13 16:45',
    hoursStale: 18,
  },
];

// Demo operator identity for this prototype console. Declared once so the audit
// entries below cannot drift from each other; admin@credalia.co matches the
// operator credential documented in docs/dev/DEV-002 and docs/qa.
const DEMO_OPERATOR_EMAIL = 'admin@credalia.co';

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'log-1',
    radicado: 'CR-2026-008990',
    actor: DEMO_OPERATOR_EMAIL,
    actorRole: 'Analista Senior de Crédito',
    action: 'Ejecución de Desembolso Manual',
    previousState: 'verified',
    newState: 'disbursed',
    timestamp: '2026-08-13 17:10',
    note: 'Transferencia ACH confirmada Lote #9012',
  },
];

export default function OperatorBackofficePage() {
  const [applications, setApplications] = useState<BackofficeApplication[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<BackofficeApplication | null>(INITIAL_APPLICATIONS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Compute triage metrics
  const triageMetrics: TriageMetrics = {
    expiredSlaCount: applications.filter((a) => a.hoursStale >= 24).length,
    pendingKycCount: applications.filter((a) => a.status === 'needs_review').length,
    unverifiedDisbursementsCount: applications.filter((a) => a.status === 'verified').length,
  };

  const handleApproveKyc = () => {
    if (!selectedApp) return;

    const newLog: AuditEntry = {
      id: `log-${Date.now()}`,
      radicado: selectedApp.radicado,
      actor: DEMO_OPERATOR_EMAIL,
      actorRole: 'Analista de Verificación KYC',
      action: 'Aprobación Manual KYC',
      previousState: selectedApp.status,
      newState: 'verified',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      note: 'Verificación documental y prueba facial liveness validadas con éxito.',
    };

    setApplications((prev) =>
      prev.map((a) => (a.radicado === selectedApp.radicado ? { ...a, status: 'verified' } : a))
    );
    setSelectedApp((prev) => (prev ? { ...prev, status: 'verified' } : null));
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRejectKyc = (reason: string) => {
    if (!selectedApp) return;

    const newLog: AuditEntry = {
      id: `log-${Date.now()}`,
      radicado: selectedApp.radicado,
      actor: DEMO_OPERATOR_EMAIL,
      actorRole: 'Analista de Verificación KYC',
      action: 'Observación / Rechazo KYC',
      previousState: selectedApp.status,
      newState: 'rejected',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      note: reason,
    };

    setApplications((prev) =>
      prev.map((a) => (a.radicado === selectedApp.radicado ? { ...a, status: 'rejected' } : a))
    );
    setSelectedApp((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleDisburseComplete = (_receiptFile: File, operatorNote: string) => {
    if (!selectedApp) return;

    const newLog: AuditEntry = {
      id: `log-${Date.now()}`,
      radicado: selectedApp.radicado,
      actor: DEMO_OPERATOR_EMAIL,
      actorRole: 'Tesorero / Administrador de Desembolsos',
      action: 'Ejecución de Desembolso 2-Step',
      previousState: selectedApp.status,
      newState: 'disbursed',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      note: operatorNote || 'Comprobante de transferencia bancaria adjuntado exitosamente.',
    };

    setApplications((prev) =>
      prev.map((a) => (a.radicado === selectedApp.radicado ? { ...a, status: 'disbursed' } : a))
    );
    setSelectedApp((prev) => (prev ? { ...prev, status: 'disbursed' } : null));
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className={`min-h-screen transition-colors ${themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-bg-soft text-foreground'} py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Workstation Navigation Bar */}
        <header className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors shadow-xs ${
          themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-border'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-extrabold text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold">Estación de Supervisión Operator Backoffice</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy/10 text-navy border border-navy/20">
                  Ley 1581 Auditable
                </span>
              </div>
              <p className="text-xs text-muted-2 mt-0.5">
                Consola de atención y dictamen de créditos en tiempo real. Operador: <b>{DEMO_OPERATOR_EMAIL}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Theme switcher */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors bg-white border-border text-navy hover:bg-bg-soft"
            >
              {themeMode === 'light' ? 'Modo Oscuro (High-Density)' : 'Modo Claro'}
            </button>

            {/* Audit Log button */}
            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-navy text-white text-xs font-bold hover:bg-navy-ink transition-colors flex items-center gap-1.5"
            >
              <ShieldCheckIcon size={16} />
              <span>Bitácora ({auditLogs.length})</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-2 hover:text-navy transition-colors ml-2"
            >
              <ReturnArrowIcon size={14} />
              <span>Salir</span>
            </Link>
          </div>
        </header>

        {/* Unified Attention Triage Banner */}
        <TriageBanner
          metrics={triageMetrics}
          onSelectFilter={() => {}}
        />

        {/* Applications Master Table */}
        <ApplicationsTable
          applications={applications}
          selectedRadicado={selectedApp?.radicado}
          onSelectApp={(app) => setSelectedApp(app)}
        />

        {/* Selected Application Review Workspace */}
        {selectedApp && (
          <div className="space-y-6">
            {selectedApp.status === 'needs_review' && (
              <SplitPaneKycDesk
                app={selectedApp}
                onApprove={handleApproveKyc}
                onReject={handleRejectKyc}
              />
            )}

            {selectedApp.status === 'verified' && (
              <DisbursementDesk
                app={selectedApp}
                onDisburseComplete={handleDisburseComplete}
              />
            )}

            {(selectedApp.status === 'disbursed' || selectedApp.status === 'rejected') && (
              <div className="p-6 rounded-2xl bg-white border border-border text-center space-y-2">
                <h3 className="text-base font-extrabold text-navy">
                  Solicitud {selectedApp.radicado} dictaminada como &quot;{selectedApp.status.toUpperCase()}&quot;
                </h3>
                <p className="text-xs text-muted-foreground">
                  Esta solicitud ya completó su flujo. Los cambios están guardados en la bitácora inmutable de auditoría.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        entries={auditLogs}
      />
    </div>
  );
}

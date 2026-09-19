'use client';

import { useState } from 'react';
import { fmtCOP } from '@/lib/credit';
import { SearchCheckIcon } from '../icons';

export type ApplicationStatus = 'verified' | 'needs_review' | 'disbursed' | 'rejected' | 'expired_sla';

export interface BackofficeApplication {
  radicado: string;
  applicantName: string;
  idNumber: string;
  phone: string;
  amount: number;
  termMonths: number;
  bankName: string;
  status: ApplicationStatus;
  livenessScore: number;
  ocrMatchPct: number;
  createdAt: string;
  hoursStale: number;
}

export function ApplicationsTable({
  applications,
  onSelectApp,
  selectedRadicado,
}: {
  applications: BackofficeApplication[];
  onSelectApp: (app: BackofficeApplication) => void;
  selectedRadicado?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.radicado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.idNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'expired_sla'
        ? app.hoursStale >= 24
        : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (app: BackofficeApplication) => {
    if (app.hoursStale >= 24) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300 tabular-nums">
          SLA Expirado ({app.hoursStale}h)
        </span>
      );
    }

    switch (app.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-tint text-green-ink border border-green/30">
            Verificado
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Revisión KYC
          </span>
        );
      case 'disbursed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            Desembolsado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-300">
            Rechazado
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Controls Header */}
      <div className="p-4 border-b border-border bg-bg-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <SearchCheckIcon size={16} className="absolute left-3 top-3 text-muted-2" />
          <input
            type="text"
            placeholder="Buscar por radicado, nombre o C.C…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.replace(/\s{2,}/g, ' '))}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-border rounded-lg outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['all', 'needs_review', 'verified', 'disbursed', 'expired_sla'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-border hover:bg-bg-soft'
              }`}
            >
              {st === 'all'
                ? 'Todos'
                : st === 'needs_review'
                ? 'En KYC'
                : st === 'verified'
                ? 'Verificados'
                : st === 'disbursed'
                ? 'Desembolsados'
                : 'SLA >24h'}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container with zero overflow */}
      <div className="overflow-x-auto max-h-[460px] table-clip">
        <table className="w-full text-xs text-left border-collapse tabular-nums">
          <thead className="sticky top-0 bg-bg-soft border-b border-border z-10 text-muted-2 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-32">Radicado</th>
              <th className="py-3 px-4 w-48">Prestatario</th>
              <th className="py-3 px-4 w-32">Cédula</th>
              <th className="py-3 px-4 w-28">Monto</th>
              <th className="py-3 px-4 w-24">Plazo</th>
              <th className="py-3 px-4 w-24">Liveness</th>
              <th className="py-3 px-4 w-24">OCR Match</th>
              <th className="py-3 px-4 w-36">Estado</th>
              <th className="py-3 px-4 w-24 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted-2">
                  No se encontraron solicitudes que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const isSelected = app.radicado === selectedRadicado;
                return (
                  <tr
                    key={app.radicado}
                    onClick={() => onSelectApp(app)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 font-semibold'
                        : 'hover:bg-bg-soft/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-navy truncate" title={app.radicado}>
                      {app.radicado}
                    </td>
                    <td className="py-3 px-4 text-navy-ink font-semibold truncate max-w-[180px]" title={app.applicantName}>
                      {app.applicantName}
                    </td>
                    <td className="py-3 px-4 text-muted-2 truncate" title={app.idNumber}>
                      {app.idNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy">
                      ${fmtCOP(app.amount)}
                    </td>
                    <td className="py-3 px-4 text-muted-2">{app.termMonths} meses</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${app.livenessScore >= 95 ? 'text-green-ink' : 'text-amber-700'}`}>
                        {app.livenessScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${app.ocrMatchPct >= 90 ? 'text-green-ink' : 'text-amber-700'}`}>
                        {app.ocrMatchPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(app)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApp(app);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-navy text-white hover:bg-navy-ink transition-colors"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

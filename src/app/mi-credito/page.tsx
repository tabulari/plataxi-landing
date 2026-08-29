'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fmtCOP } from '@/lib/credit';
import { config } from '@/lib/config';
import { CheckIcon, CalendarIcon, DocUploadIcon, ReturnArrowIcon, VerifiedCircleIcon } from '@/components/icons';

export default function ActiveCreditPage() {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);

  // Mock Active Credit details
  const credit = {
    creditId: 'CR-2026-90412',
    borrowerName: 'Laura Martínez Gómez',
    totalAmount: 500000,
    currentBalance: 375000,
    nextPaymentAmount: 49039,
    nextPaymentDueDate: '28 de Agosto, 2026',
    daysUntilDue: 14,
    paidInstallments: 3,
    totalInstallments: 12,
    monthlyRatePct: '2.6% m.v.',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
      setProofSuccess(false);
    }
  };

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile || !referenceNumber.trim()) return;

    setIsSubmittingProof(true);
    setTimeout(() => {
      setIsSubmittingProof(false);
      setProofSuccess(true);
      setProofFile(null);
      setProofPreview(null);
      setReferenceNumber('');
    }, 1400);
  };

  const progressPct = (credit.paidInstallments / credit.totalInstallments) * 100;

  return (
    <div className="min-h-screen bg-bg-soft text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-extrabold text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-navy">Mesa de Gestión - Mi Crédito Activo</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-tint text-green-ink border border-green/30">
                  Vigente
                </span>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums mt-0.5">
                Crédito: <b className="text-navy">{credit.creditId}</b> • {credit.borrowerName}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-2 hover:text-navy transition-colors self-start sm:self-auto"
          >
            <ReturnArrowIcon size={14} />
            <span>Volver al Inicio</span>
          </Link>
        </header>

        {/* Primary Balance & Due Date Card */}
        <div className="bg-navy text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Saldo Pendiente</span>
              <div className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight">
                ${fmtCOP(credit.currentBalance)} <span className="text-sm font-semibold text-white/70">COP</span>
              </div>
              <p className="text-xs text-white/70 tabular-nums">Monto original: ${fmtCOP(credit.totalAmount)} COP</p>
            </div>

            <div className="space-y-1 md:border-l md:border-white/15 md:pl-6">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Próxima Cuota</span>
              <div className="text-2xl sm:text-3xl font-bold tabular-nums text-green-bright">
                ${fmtCOP(credit.nextPaymentAmount)} <span className="text-xs font-normal text-white">/mes</span>
              </div>
              <p className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                <CalendarIcon size={14} className="text-green-bright" />
                Vence el {credit.nextPaymentDueDate} ({credit.daysUntilDue} días)
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-white/15 md:pl-6">
              <div className="flex justify-between text-xs font-semibold">
                <span>Cuotas Pagadas</span>
                <span className="tabular-nums">{credit.paidInstallments} de {credit.totalInstallments}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div className="bg-green-bright h-full transition-all duration-500 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-[11px] text-white/60">Tasa nominal contratada: {credit.monthlyRatePct}</p>
            </div>
          </div>
        </div>

        {/* Grid layout: Payment Instructions & Payment Proof Upload Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Info */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-navy">Métodos de Pago Autorizados</h3>
            <p className="text-xs text-muted-foreground">
              Puedes realizar tus pagos por PSE, DaviPlata o Nequi usando tu referencia de crédito:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border bg-bg-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                    N
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">Nequi</h4>
                    <p className="text-xs text-muted-2">Convenio {config.brandName} • Celular 300 900 1122</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-navy bg-white border border-border px-2.5 py-1 rounded-md">
                  Inmediato
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-bg-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">DaviPlata</h4>
                    <p className="text-xs text-muted-2">Pagos de servicios • Ref: {credit.creditId}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-navy bg-white border border-border px-2.5 py-1 rounded-md">
                  Inmediato
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-bg-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    PSE
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">Botón PSE</h4>
                    <p className="text-xs text-muted-2">Debito bancario desde cualquier banco</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-navy bg-white border border-border px-2.5 py-1 rounded-md">
                  PSE Directo
                </span>
              </div>
            </div>
          </div>

          {/* Payment Proof Upload Form */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-navy">Subir Comprobante de Pago</h3>
            <p className="text-xs text-muted-foreground">
              Sube la foto o PDF del recibo para conciliar tu cuota al instante.
            </p>

            {proofSuccess && (
              <div className="p-3.5 rounded-xl bg-green-tint border border-green/30 text-green-ink text-xs font-bold flex items-center gap-2">
                <VerifiedCircleIcon size={18} />
                <span>¡Comprobante enviado a verificación! Código de conciliación registrado.</span>
              </div>
            )}

            <form onSubmit={handleUploadProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Número de Referencia o Transacción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. NQ-891023412"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Imagen o PDF del Comprobante</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-navy transition-colors bg-bg-soft">
                  {proofPreview ? (
                    <div className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={proofPreview} alt="Vista previa del comprobante" className="max-h-32 mx-auto rounded-lg border border-border object-contain" />
                      <p className="text-xs text-navy font-bold truncate">{proofFile?.name}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-1">
                      <DocUploadIcon size={24} className="mx-auto text-muted-2" />
                      <span className="text-xs font-bold text-navy block">Seleccionar comprobante</span>
                      <span className="text-[11px] text-muted-2 block">JPG, PNG o PDF hasta 5MB</span>
                      <input type="file" accept=".jpg,.png,.pdf" className="sr-only" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingProof || !proofFile || !referenceNumber.trim()}
                className="w-full py-3 rounded-xl bg-navy text-white text-sm font-extrabold hover:bg-navy-ink disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isSubmittingProof ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Verificando comprobante...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon size={18} />
                    <span>Registrar Pago</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

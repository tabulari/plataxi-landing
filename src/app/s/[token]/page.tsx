'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { SevenStageStepper, type StageId } from '@/components/borrower/SevenStageStepper';
import { KycDocumentStation } from '@/components/borrower/KycDocumentStation';
import { OtpContractModal } from '@/components/borrower/OtpContractModal';
import { LockIcon, ShieldCheckIcon, CheckIcon, ReturnArrowIcon } from '@/components/icons';
import { fmtCOP } from '@/lib/credit';

export default function BorrowerWorkspacePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [stage, setStage] = useState<StageId>(2); // Default to stage 2: Verificación de Identidad
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // Mock application details derived from session token
  const mockApplication = {
    radicado: token.startsWith('CR-') ? token : `CR-2026-${token.slice(0, 8).toUpperCase()}`,
    borrowerName: 'Laura Martínez Gómez',
    borrowerId: '1.024.567.890',
    amount: 500000,
    termMonths: 12,
    monthlyPayment: 49039,
    bankName: 'Bancolombia',
    accountType: 'Ahorros ***4829',
  };

  const handleOtpSuccess = () => {
    setIsOtpOpen(false);
    setStage(6); // Advance to Desembolso
    setTimeout(() => {
      setStage(7); // Automatically transition to Active Credit after disbursement simulation
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-bg-soft text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Workspace Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-extrabold text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-navy">Espacio Digital del Prestatario</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-tint text-green-ink border border-green/30">
                  Ley 1581 Seguro
                </span>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums mt-0.5">
                Radicado: <b className="text-navy">{mockApplication.radicado}</b> • Titular: <b>{mockApplication.borrowerName}</b>
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

        {/* 7-Stage Visual Stepper */}
        <SevenStageStepper currentStage={stage} />

        {/* Dynamic Stage Workspace Body */}
        {stage === 2 && (
          <div className="space-y-6">
            <KycDocumentStation onComplete={() => setStage(3)} />

            <div className="flex justify-end gap-3 bg-white p-4 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setStage(3)}
                className="px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy-ink transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Avanzar a Evaluación de Crédito</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <span className="btn-spinner border-blue-600 border-t-transparent w-7 h-7 border-3" />
            </div>
            <h3 className="text-lg font-extrabold text-navy">Evaluación de Crédito en Curso</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Estamos consultando las centrales de riesgo y ejecutando el scoring scoring en tiempo real. Este proceso toma menos de 60 segundos.
            </p>
            <button
              type="button"
              onClick={() => setStage(4)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy-ink transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              Simular Aprobación de Oferta →
            </button>
          </div>
        )}

        {stage === 4 && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-tint border border-green/30 text-green-ink">
              <ShieldCheckIcon size={28} className="text-green flex-shrink-0" />
              <div>
                <h3 className="text-base font-extrabold">¡Tu crédito ha sido aprobado!</h3>
                <p className="text-xs mt-0.5">
                  Revisa las condiciones definitivas antes de proceder a la firma electrónica del contrato.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
              <div className="p-3.5 rounded-xl bg-bg-soft border border-border">
                <span className="text-xs text-muted-2 font-medium block">Monto Aprobado</span>
                <strong className="text-lg font-extrabold text-navy">${fmtCOP(mockApplication.amount)} COP</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-bg-soft border border-border">
                <span className="text-xs text-muted-2 font-medium block">Plazo</span>
                <strong className="text-lg font-extrabold text-navy">{mockApplication.termMonths} meses</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-bg-soft border border-border">
                <span className="text-xs text-muted-2 font-medium block">Cuota Mensual</span>
                <strong className="text-lg font-extrabold text-green-ink">${fmtCOP(mockApplication.monthlyPayment)} /mes</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-bg-soft border border-border">
                <span className="text-xs text-muted-2 font-medium block">Cuenta de Desembolso</span>
                <strong className="text-sm font-bold text-navy">{mockApplication.bankName}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setStage(5); setIsOtpOpen(true); }}
                className="px-8 py-3 rounded-xl bg-navy text-white text-sm font-extrabold hover:bg-navy-ink transition-colors shadow-md flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LockIcon size={16} />
                <span>Proceder a Firma de Contrato (OTP)</span>
              </button>
            </div>
          </div>
        )}

        {stage === 5 && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm text-center space-y-4">
            <h3 className="text-lg font-extrabold text-navy">Firma de Contrato Pagaré Pendiente</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Para formalizar el desembolso debes ingresar el código de verificación OTP enviado a tu teléfono celular.
            </p>
            <button
              type="button"
              onClick={() => setIsOtpOpen(true)}
              className="px-8 py-3 rounded-xl bg-navy text-white text-sm font-extrabold hover:bg-navy-ink transition-colors shadow-md inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LockIcon size={16} />
              <span>Abrir Ventana de Firma OTP</span>
            </button>
          </div>
        )}

        {stage === 6 && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <span className="btn-spinner border-amber-600 border-t-transparent w-7 h-7 border-3" />
            </div>
            <h3 className="text-lg font-extrabold text-navy">Desembolso en Proceso</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Estamos realizando la transferencia por <b>${fmtCOP(mockApplication.amount)} COP</b> a tu cuenta <b>{mockApplication.bankName}</b>. Recibirás la notificación en unos minutos.
            </p>
            <button
              type="button"
              onClick={() => setStage(7)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-green-ink text-white text-sm font-bold hover:bg-green-soft-ink transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver Mi Crédito Activo →
            </button>
          </div>
        )}

        {stage === 7 && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-ink text-white flex items-center justify-center mx-auto shadow-md">
              <CheckIcon size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-navy">¡Crédito Activo y Desembolsado!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tu crédito ha sido desembolsado exitosamente. Ya puedes consultar tu plan de pagos y subir comprobantes desde tu mesa de gestión.
            </p>
            <div className="pt-2">
              <a
                href="/mi-credito"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-navy text-white text-sm font-extrabold hover:bg-navy-ink transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Ir a Mi Crédito y Plan de Pagos</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <OtpContractModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        amount={mockApplication.amount}
        termMonths={mockApplication.termMonths}
        monthlyPayment={mockApplication.monthlyPayment}
        borrowerName={mockApplication.borrowerName}
        borrowerId={mockApplication.borrowerId}
      />
    </div>
  );
}

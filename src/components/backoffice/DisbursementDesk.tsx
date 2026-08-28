'use client';

import { useState } from 'react';
import { type BackofficeApplication } from './ApplicationsTable';
import { CheckIcon, DocUploadIcon, VerifiedCircleIcon, AlertCircleIcon } from '../icons';
import { fmtCOP } from '@/lib/credit';

export function DisbursementDesk({
  app,
  onDisburseComplete,
}: {
  app: BackofficeApplication;
  onDisburseComplete: (receiptFile: File, operatorNote: string) => void;
}) {
  const [checkAccount, setCheckAccount] = useState(false);
  const [checkContract, setCheckContract] = useState(false);
  const [checkRisk, setCheckRisk] = useState(false);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [operatorNote, setOperatorNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isChecklistComplete = checkAccount && checkContract && checkRisk && receiptFile;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleConfirmDisbursement = () => {
    if (!receiptFile) return;
    onDisburseComplete(receiptFile, operatorNote);
    setShowConfirmModal(false);
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-extrabold text-navy">
            Mesa de Ejecución de Desembolso Manual - {app.radicado}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verifica los rieles de desembolso antes de adjuntar el comprobante bancario definitivo.
          </p>
        </div>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 tabular-nums">
          Monto: ${fmtCOP(app.amount)} COP
        </span>
      </div>

      {/* 3-Point Mandatory Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy">
          Lista de Verificación Obligatoria (Rieles 2-Step)
        </h4>

        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={checkAccount}
              onChange={(e) => setCheckAccount(e.target.checked)}
              className="w-4 h-4 accent-navy rounded"
            />
            <div>
              <span className="text-xs font-bold text-navy">1. Titularidad de Cuenta Bancaria ACH Verificada</span>
              <p className="text-[11px] text-muted-2">
                Cuenta de Ahorros {app.bankName} a nombre de {app.applicantName} (C.C. {app.idNumber}).
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={checkContract}
              onChange={(e) => setCheckContract(e.target.checked)}
              className="w-4 h-4 accent-navy rounded"
            />
            <div>
              <span className="text-xs font-bold text-navy">2. Pagaré y Carta de Instrucciones Firmados vía OTP</span>
              <p className="text-[11px] text-muted-2">
                Código OTP verificado exitosamente (Firma Electrónica Ley 527/1999).
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={checkRisk}
              onChange={(e) => setCheckRisk(e.target.checked)}
              className="w-4 h-4 accent-navy rounded"
            />
            <div>
              <span className="text-xs font-bold text-navy">3. Aprobación de Riesgo y Scoring Operativo</span>
              <p className="text-[11px] text-muted-2">
                Evaluación de capacidad de pago aprobada sin alertas de fraude.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Transfer Receipt Attachment */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-navy">
          4. Adjuntar Comprobante de Transferencia Bancaria (Requerido)
        </label>
        <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-bg-soft">
          {receiptFile ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-border">
              <div className="flex items-center gap-2 text-xs font-bold text-navy">
                <VerifiedCircleIcon size={18} className="text-green" />
                <span className="truncate max-w-xs">{receiptFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptFile(null)}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block space-y-1">
              <DocUploadIcon size={22} className="mx-auto text-muted-2" />
              <span className="text-xs font-bold text-navy block">Subir Recibo de Transferencia</span>
              <span className="text-[11px] text-muted-2 block">Formato PDF, JPG o PNG (Máx 10MB)</span>
              <input type="file" accept=".pdf,.jpg,.png" className="sr-only" onChange={handleFileSelect} />
            </label>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          disabled={!isChecklistComplete}
          onClick={() => setShowConfirmModal(true)}
          className="px-8 py-3 rounded-xl bg-navy text-white text-xs font-extrabold hover:bg-navy-ink disabled:opacity-40 transition-colors shadow-md flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CheckIcon size={16} />
          <span>Confirmar y Ejecutar Desembolso (2-Step)</span>
        </button>
      </div>

      {/* 2-Step Final Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-ink/70 backdrop-blur-sm animate-overlay-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border animate-dialog-in">
            <div className="flex items-center gap-2 text-navy">
              <AlertCircleIcon size={24} className="text-amber-600" />
              <h3 className="text-lg font-extrabold">Confirmación Final de Desembolso</h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              ¿Estás seguro de autorizar el desembolso de <b>${fmtCOP(app.amount)} COP</b> a la cuenta de <b>{app.applicantName}</b>? Esta acción quedará registrada en la bitácora inmutable de auditoría.
            </p>

            <div>
              <label className="block text-xs font-bold text-navy mb-1">Nota de Operación / Referencia Bancaria</label>
              <input
                type="text"
                placeholder="Ej. Transferencia ACH aprobada Lote #9012"
                value={operatorNote}
                onChange={(e) => setOperatorNote(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-border outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-muted-2 hover:text-navy"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDisbursement}
                className="px-6 py-2 text-xs font-extrabold rounded-xl bg-green-ink text-white hover:bg-green-soft-ink transition-colors shadow-sm"
              >
                Confirmar Desembolso Definitivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

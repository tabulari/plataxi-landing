'use client';

import { useState } from 'react';
import { type BackofficeApplication } from './ApplicationsTable';
import { CheckIcon, ShieldCheckIcon } from '../icons';
import { fmtCOP } from '@/lib/credit';

export function SplitPaneKycDesk({
  app,
  onApprove,
  onReject,
}: {
  app: BackofficeApplication;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [activeDocTab, setActiveDocTab] = useState<'cc_front' | 'cc_back' | 'income'>('cc_front');
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.75, prev + delta)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetViewer = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-navy">
              Mesa de Verificación KYC - Radicado {app.radicado}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Liveness {app.livenessScore}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compara la información declarada por el usuario con la extracción OCR y el documento escaneado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRejectForm(!showRejectForm)}
            className="px-4 py-2 rounded-xl bg-red-100 text-red-800 border border-red-300 text-xs font-bold hover:bg-red-200 transition-colors"
          >
            Observación / Rechazar
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-5 py-2 rounded-xl bg-green-ink text-white text-xs font-bold hover:bg-green-soft-ink transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CheckIcon size={16} />
            <span>Aprobar KYC</span>
          </button>
        </div>
      </div>

      {showRejectForm && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
          <label className="block text-xs font-bold text-red-900">
            Motivo de observación o rechazo (se notificará al usuario en su espacio digital):
          </label>
          <textarea
            rows={2}
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            placeholder="Ej. La fotocopia de la cédula está borrosa o la fecha del extracto bancario supera los 30 días..."
            className="w-full text-xs p-2.5 rounded-lg border border-red-300 bg-white outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="px-3 py-1.5 text-xs font-bold text-muted-2 hover:text-navy"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!rejectionNote.trim()}
              onClick={() => {
                onReject(rejectionNote);
                setShowRejectForm(false);
              }}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      )}

      {/* Split Pane: Left (Data Comparison Table) | Right (Document Lightbox) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Side-by-side Data Comparison */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy">
            Cotejo Datos Formulario vs. Extracción OCR
          </h4>

          <div className="border border-border rounded-xl overflow-hidden text-xs tabular-nums">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-soft border-b border-border text-muted-2 font-bold">
                  <th className="py-2.5 px-3">Campo</th>
                  <th className="py-2.5 px-3">Declarado Usuario</th>
                  <th className="py-2.5 px-3">Extraído OCR</th>
                  <th className="py-2.5 px-3 text-center">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-bg-soft/50">
                  <td className="py-2.5 px-3 font-semibold text-navy">Nombre Completo</td>
                  <td className="py-2.5 px-3 text-navy-ink">{app.applicantName}</td>
                  <td className="py-2.5 px-3 text-navy-ink">{app.applicantName}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green" />
                  </td>
                </tr>

                <tr className="hover:bg-bg-soft/50">
                  <td className="py-2.5 px-3 font-semibold text-navy">Cédula C.C.</td>
                  <td className="py-2.5 px-3 text-navy-ink">{app.idNumber}</td>
                  <td className="py-2.5 px-3 text-navy-ink">{app.idNumber}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green" />
                  </td>
                </tr>

                <tr className="hover:bg-bg-soft/50">
                  <td className="py-2.5 px-3 font-semibold text-navy">Teléfono Celular</td>
                  <td className="py-2.5 px-3 text-navy-ink">{app.phone}</td>
                  <td className="py-2.5 px-3 text-muted-2">Validado SMS</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green" />
                  </td>
                </tr>

                <tr className="hover:bg-bg-soft/50">
                  <td className="py-2.5 px-3 font-semibold text-navy">Monto / Banco</td>
                  <td className="py-2.5 px-3 text-navy-ink">${fmtCOP(app.amount)} ({app.bankName})</td>
                  <td className="py-2.5 px-3 text-navy-ink">Cuenta Validada ACH</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Liveness & Scoring Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-green/30 bg-green-tint/40 space-y-1">
              <span className="text-[11px] font-bold text-green-ink uppercase block">Biometría Liveness</span>
              <div className="text-xl font-extrabold text-green-ink tabular-nums">{app.livenessScore}% Prueba Facial</div>
              <p className="text-[11px] text-green-soft-ink">Sin indicios de suplantación o deepfake</p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
              <span className="text-[11px] font-bold text-blue-900 uppercase block">OCR Accuracy</span>
              <div className="text-xl font-extrabold text-blue-900 tabular-nums">{app.ocrMatchPct}% Coincidencia</div>
              <p className="text-[11px] text-blue-700">MRZ y código de barras legibles</p>
            </div>
          </div>
        </div>

        {/* Right Side: Document Lightbox Viewer with Zoom & Rotation */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            {/* Tabs for active document */}
            <div className="flex items-center gap-1.5 bg-bg-soft p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => { setActiveDocTab('cc_front'); resetViewer(); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeDocTab === 'cc_front' ? 'bg-white text-navy shadow-2xs' : 'text-muted-2'
                }`}
              >
                Cédula Frente
              </button>
              <button
                type="button"
                onClick={() => { setActiveDocTab('cc_back'); resetViewer(); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeDocTab === 'cc_back' ? 'bg-white text-navy shadow-2xs' : 'text-muted-2'
                }`}
              >
                Cédula Reverso
              </button>
              <button
                type="button"
                onClick={() => { setActiveDocTab('income'); resetViewer(); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeDocTab === 'income' ? 'bg-white text-navy shadow-2xs' : 'text-muted-2'
                }`}
              >
                Ingresos PDF
              </button>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleZoom(-0.25)}
                className="w-7 h-7 rounded-md border border-border bg-white text-navy font-bold text-xs hover:bg-bg-soft"
                title="Alejar (-)"
              >
                -
              </button>
              <span className="text-[11px] font-bold text-navy w-12 text-center tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoom(0.25)}
                className="w-7 h-7 rounded-md border border-border bg-white text-navy font-bold text-xs hover:bg-bg-soft"
                title="Acercar (+)"
              >
                +
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="ml-1 px-2 py-1 rounded-md border border-border bg-white text-navy font-bold text-[11px] hover:bg-bg-soft"
                title="Rotar 90°"
              >
                Rotar 90°
              </button>
            </div>
          </div>

          {/* Lightbox Canvas Viewport */}
          <div className="w-full h-72 bg-navy-ink rounded-xl border border-border overflow-hidden relative flex items-center justify-center p-4">
            <div
              className="transition-transform duration-200 max-w-full max-h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              }}
            >
              {/* SVG Mock Document display */}
              <div className="w-72 h-44 bg-slate-100 rounded-lg shadow-lg border-2 border-slate-300 p-4 flex flex-col justify-between text-navy select-none">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon size={18} className="text-navy" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy">
                      REPUBLICA DE COLOMBIA
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-muted-2">CÉDULA DE CIUDADANÍA</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-18 bg-slate-300 rounded border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    FOTO
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <p className="font-extrabold text-navy">{app.applicantName}</p>
                    <p className="font-bold text-slate-700">NUM: {app.idNumber}</p>
                    <p className="text-slate-500">FECHA NAC: 14 MAY 1994</p>
                  </div>
                </div>

                <div className="text-[8px] text-slate-400 font-mono text-right">
                  COL-CC-{app.radicado.slice(-6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

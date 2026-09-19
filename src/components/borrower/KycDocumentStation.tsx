'use client';

import { useState } from 'react';
import { DocUploadIcon, CheckIcon, AlertCircleIcon, DocumentIcon } from '../icons';

export type DocStatus = 'idle' | 'uploading' | 'under_review' | 'approved' | 'rejected';

export interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  status: DocStatus;
  fileName?: string;
  fileSize?: string;
  rejectionReason?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'cc_front',
    name: 'Cédula de Ciudadanía (Frente)',
    required: true,
    status: 'approved',
    fileName: 'cedula_frente_scan.jpg',
    fileSize: '2.4 MB',
  },
  {
    id: 'cc_back',
    name: 'Cédula de Ciudadanía (Reverso)',
    required: true,
    status: 'under_review',
    fileName: 'cedula_reverso_scan.jpg',
    fileSize: '2.1 MB',
  },
  {
    id: 'income_proof',
    name: 'Certificación Laboral o Extracto Bancario',
    required: true,
    status: 'rejected',
    fileName: 'extracto_bancario.pdf',
    fileSize: '3.8 MB',
    rejectionReason: 'La imagen está borrosa o la fecha del extracto es superior a 30 días.',
  },
];

export function KycDocumentStation({ onComplete }: { onComplete?: () => void }) {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);

  const handleSimulatedUpload = (docId: string, file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo excede el tamaño máximo permitido de 10MB.');
      return;
    }

    // Set uploading state
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: 'uploading',
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              rejectionReason: undefined,
            }
          : d
      )
    );

    // Simulate 1.5s upload completion
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'under_review' } : d))
      );
      if (onComplete) onComplete();
    }, 1500);
  };

  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulatedUpload(docId, e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-extrabold text-navy">Documentos y Verificación KYC</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjunta tus archivos legibles en formato PDF, JPG o PNG (máximo 10MB por archivo).
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Ley 1581 Encriptado
        </span>
      </div>

      <div className="space-y-4 mt-4">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`border rounded-xl p-4 transition-[transform,opacity,background-color,box-shadow,border-color] ${
              doc.status === 'rejected'
                ? 'border-red-300 bg-red-50/50'
                : doc.status === 'approved'
                ? 'border-green/30 bg-green-tint/30'
                : doc.status === 'under_review'
                ? 'border-blue-200 bg-blue-50/30'
                : 'border-border bg-bg-soft'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-lg flex-shrink-0 ${
                    doc.status === 'approved'
                      ? 'bg-green-soft text-green-ink'
                      : doc.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-white border border-border text-navy'
                  }`}
                >
                  <DocumentIcon size={22} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-navy">{doc.name}</h4>
                    {doc.required && (
                      <span className="text-[10px] font-bold text-orange uppercase">Requerido</span>
                    )}
                  </div>

                  {doc.fileName ? (
                    <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                      {doc.fileName} • {doc.fileSize}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-2 mt-0.5">Ningún archivo cargado aún</p>
                  )}
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-3">
                {doc.status === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-ink bg-green-tint px-3 py-1.5 rounded-full border border-green/30">
                    <CheckIcon size={14} />
                    Aprobado
                  </span>
                )}

                {doc.status === 'under_review' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                    En Revisión
                  </span>
                )}

                {doc.status === 'uploading' && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-navy bg-white px-3 py-1.5 rounded-full border border-border">
                    <span className="btn-spinner border-navy border-t-transparent" />
                    Subiendo...
                  </span>
                )}

                {doc.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full border border-red-200">
                    <AlertCircleIcon size={14} />
                    Observación
                  </span>
                )}

                {(doc.status === 'idle' || doc.status === 'rejected') && (
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy hover:bg-navy-ink rounded-lg transition-colors shadow-sm focus-within:ring-2 focus-within:ring-ring">
                    <DocUploadIcon size={16} />
                    <span>{doc.status === 'rejected' ? 'Reintentar Carga' : 'Subir Archivo'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => handleFileChange(doc.id, e)}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Rejection notice box */}
            {doc.status === 'rejected' && doc.rejectionReason && (
              <div className="mt-3 p-3 rounded-lg bg-white border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircleIcon size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Motivo de rechazo u observación:</strong>
                  <p className="mt-0.5 text-red-700">{doc.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

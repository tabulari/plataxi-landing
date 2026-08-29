'use client';

import { useState, useEffect, useRef } from 'react';
import { LockIcon, CheckIcon, ShieldCheckIcon, CloseIcon } from '../icons';
import { fmtCOP } from '@/lib/credit';
import { config } from '@/lib/config';

interface OtpContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  termMonths: number;
  monthlyPayment: number;
  borrowerName: string;
  borrowerId: string;
}

export function OtpContractModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  termMonths,
  monthlyPayment,
  borrowerName,
  borrowerId,
}: OtpContractModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setErrorMsg('');
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setErrorMsg('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg('Ingresa el código OTP de 6 dígitos enviado a tu celular.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    // Simulate OTP verification API call
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 1200);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setErrorMsg('Nuevo código OTP enviado vía SMS/WhatsApp.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-ink/70 backdrop-blur-sm animate-overlay-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-border overflow-hidden animate-dialog-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-soft">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon size={22} className="text-green-ink" />
            <h3 id="contract-modal-title" className="text-lg font-extrabold text-navy">
              Firma Electrónica de Contrato (Pagaré)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-2 text-muted-2 hover:text-navy rounded-lg hover:bg-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable contract preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Promissory note summary card */}
          <div className="border border-border rounded-xl p-4 bg-white shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-2 mb-3">
              Resumen del Pagaré en Blanco con Carta de Instrucciones
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
              <div className="p-2.5 rounded-lg bg-bg-soft border border-border/60">
                <span className="text-muted-2 font-medium block">Deudor</span>
                <strong className="text-navy font-bold">{borrowerName}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-soft border border-border/60">
                <span className="text-muted-2 font-medium block">Cédula C.C.</span>
                <strong className="text-navy font-bold">{borrowerId}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-soft border border-border/60">
                <span className="text-muted-2 font-medium block">Monto Aprobado</span>
                <strong className="text-green-ink font-bold">${fmtCOP(amount)} COP</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-soft border border-border/60">
                <span className="text-muted-2 font-medium block">Cuota / Plazo</span>
                <strong className="text-navy font-bold">${fmtCOP(monthlyPayment)} / {termMonths} m</strong>
              </div>
            </div>
          </div>

          {/* Promissory note excerpt legal box */}
          <div className="bg-bg-soft border border-border rounded-xl p-4 text-xs text-muted-foreground leading-relaxed max-h-40 overflow-y-auto space-y-2">
            <p className="font-semibold text-navy">
              PAGARÉ NÚMERO CR-{new Date().getFullYear()}-009182
            </p>
            <p>
              Por medio del presente instrumento, el suscrito <strong>{borrowerName}</strong> identificado con C.C. <strong>{borrowerId}</strong> declara que debe y pagará incondicionalmente a la orden de <strong>{config.company.legalName}</strong> la suma de <strong>${fmtCOP(amount)} COP</strong> más los intereses corrientes estipulados conforme a la reglamentación de la Superintendencia Financiera de Colombia.
            </p>
            <p>
              Autorizo expresamente el diligenciamiento de este Pagaré conforme a la Carta de Instrucciones adjunta en caso de mora o incumplimiento en el plan de cuotas acordado.
            </p>
          </div>

          {/* OTP Input Section */}
          <div className="text-center pt-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-tint text-green-ink text-xs font-bold border border-green/20">
              <LockIcon size={14} />
              Firma Electrónica Autorizada (Ley 527 de 1999)
            </div>
            <p className="text-sm font-semibold text-navy">
              Ingresa el código OTP de 6 dígitos enviado a tu número celular registrado:
            </p>

            {/* 6-Digit OTP inputs */}
            <div className="flex justify-center gap-2 sm:gap-3 my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 text-center font-extrabold text-xl text-navy bg-white border-2 border-border rounded-xl focus:border-green focus:ring-2 focus:ring-green/20 outline-none tabular-nums"
                />
              ))}
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className="text-navy font-bold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {timer > 0 ? `Reenviar código en ${timer}s` : 'Reenviar código OTP'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-bg-soft flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-2 text-center sm:text-left">
            Al firmar, confirmas la aceptación total del pagaré y la carta de instrucciones.
          </p>
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-navy text-white text-sm font-extrabold hover:bg-navy-ink disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isVerifying ? (
              <>
                <span className="btn-spinner" />
                <span>Firmando Pagaré...</span>
              </>
            ) : (
              <>
                <CheckIcon size={18} />
                <span>Firmar y Aceptar Contrato</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { fmtCOP } from '@/lib/credit';
import {
  BANKS,
  CONSENT_TEXT,
  EMPLOYMENT_TYPES,
  type FieldName,
} from '@/lib/application-schema';
import { capFreq } from './use-application-form';
import { cn } from '@/lib/utils';
import type { Values } from './use-application-form';
import { WhatsAppLink } from '../WhatsAppLink';
import { CloseIcon, ShieldCheckIcon } from '../icons';

type FieldHandlers = {
  onFieldChange: (name: FieldName, raw: string) => void;
  onFieldBlur: (name: FieldName, value: string) => void;
  errors: Partial<Record<FieldName, string>>;
};

const fieldEl = (name: FieldName, label: string, handlers: FieldHandlers, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
  <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_input]:border-destructive')}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <input
      name={name}
      onChange={(e) => handlers.onFieldChange(name, e.target.value)}
      onBlur={(e) => handlers.onFieldBlur(name, (e.target as HTMLInputElement).value)}
      aria-invalid={handlers.errors[name] ? true : undefined}
      aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
      className="h-11 min-h-[44px] w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none focus:border-green focus:ring-2 focus:ring-green/20 transition-colors shadow-2xs"
      {...props}
    />
    <span className="text-xs text-destructive min-h-4" id={`err-${name}`} role="alert">{handlers.errors[name] || ''}</span>
  </label>
);

const selectEl = (name: FieldName, label: string, placeholder: string, options: readonly string[], handlers: FieldHandlers, value: string) => (
  <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_select]:border-destructive')}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <select
      name={name}
      value={value}
      onChange={(e) => { handlers.onFieldChange(name, e.target.value); }}
      aria-invalid={handlers.errors[name] ? true : undefined}
      aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
      className="h-11 min-h-[44px] w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none focus:border-green focus:ring-2 focus:ring-green/20 transition-colors shadow-2xs cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <span className="text-xs text-destructive min-h-4" id={`err-${name}`} role="alert">{handlers.errors[name] || ''}</span>
  </label>
);

export function Step1({ values, handlers }: {
  values: Values;
  applyOrigin: string;
  handlers: FieldHandlers;
  frozen: { amount: number; term: number; payment: number; unit: string };
}) {
  const formatCedula = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return fmtCOP(parseInt(digits, 10));
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  return (
    <section className="flex-1 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-navy tracking-tight">Datos personales y de contacto</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Tus datos están protegidos bajo la Ley 1581 y solo se usan para validar tu solicitud.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {fieldEl('fullName', 'Nombre completo', handlers, {
          type: 'text',
          autoComplete: 'name',
          placeholder: 'Ej. Laura Martínez',
          value: values.fullName,
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fieldEl('idNumber', 'Número de cédula (C.C.)', handlers, {
          type: 'text',
          inputMode: 'numeric',
          placeholder: 'Ej. 1.024.567.890',
          value: values.idNumber,
          onChange: (e) => handlers.onFieldChange('idNumber', formatCedula(e.target.value)),
        })}
        {fieldEl('phone', 'Celular Colombia (+57)', handlers, {
          type: 'tel',
          inputMode: 'numeric',
          placeholder: 'Ej. 300 123 4567',
          value: values.phone,
          onChange: (e) => handlers.onFieldChange('phone', formatPhone(e.target.value)),
        })}
      </div>

      <div>
        {fieldEl('email', 'Correo electrónico', handlers, {
          type: 'email',
          autoComplete: 'email',
          placeholder: 'tucorreo@ejemplo.com',
          value: values.email,
        })}
      </div>

      <div className="mt-2 text-center">
        <WhatsAppLink ctx="contact" className="text-xs text-muted-foreground hover:text-green-ink transition-colors underline underline-offset-2">
          ¿Prefieres solicitar por WhatsApp?
        </WhatsAppLink>
      </div>
    </section>
  );
}

export function Step2({ values, handlers }: { values: Values; handlers: FieldHandlers }) {
  return (
    <section className="flex-1 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-navy tracking-tight">Información de ingresos y desembolso</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Ingresa tus datos para transferir los fondos una vez aprobada tu solicitud.
        </p>
      </div>

      {selectEl('employmentType', 'Tipo de actividad laboral', 'Selecciona tu actividad', EMPLOYMENT_TYPES, handlers, values.employmentType)}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fieldEl('income', 'Ingreso mensual aproximado', handlers, {
          type: 'text',
          inputMode: 'numeric',
          placeholder: '$ 0 COP',
          value: values.income,
        })}
        {selectEl('bank', 'Cuenta o billetera para desembolso', 'Selecciona Nequi, DaviPlata o Banco', BANKS, handlers, values.bank)}
      </div>
    </section>
  );
}

export function Step3({ values, consent, consentError, setConsent, setConsentError, frozen }: {
  values: Values;
  consent: boolean;
  consentError: string;
  setConsent: (v: boolean) => void;
  setConsentError: (v: string) => void;
  frozen: { amount: number; term: number; payment: number; unit: string; frequency: string; periodRate: number };
}) {
  const [showTerms, setShowTerms] = useState(false);

  const reviewRows: [string, string, boolean?][] = [
    ['Monto solicitado', `$${fmtCOP(frozen.amount)} COP`],
    ['Cuota estimada', `$${fmtCOP(frozen.payment)} ${frozen.unit}`],
    ['Plazo', `${frozen.term} meses (${capFreq(frozen.frequency as 'monthly' | 'biweekly')})`],
    ['Nombre completo', values.fullName || '—', true],
    ['Cédula de ciudadanía', values.idNumber || '—'],
    ['Celular', values.phone || '—'],
    ['Correo electrónico', values.email || '—', true],
    ['Actividad laboral', values.employmentType || '—'],
    ['Cuenta de desembolso', values.bank || '—'],
  ];

  return (
    <section className="flex-1 flex flex-col gap-4 relative">
      <div>
        <h2 className="text-xl font-bold text-navy tracking-tight">Revisa y confirma tu solicitud</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Verifica que la información sea correcta antes de enviar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-bg-soft rounded-xl border border-border/80 text-xs">
        {reviewRows.map(([k, v, full]) => (
          <div key={k} className={cn('flex flex-col gap-0.5', full && 'col-span-2')}>
            <span className="text-muted-2 font-medium">{k}</span>
            <span className="font-semibold text-navy text-xs sm:text-sm">{v}</span>
          </div>
        ))}
      </div>

      <label className="flex gap-3 items-start text-xs sm:text-sm cursor-pointer p-1">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'consentError' : undefined}
          onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(''); }}
          className="mt-0.5 accent-green w-4 h-4 rounded"
        />
        <span className="text-muted-foreground leading-snug">
          {CONSENT_TEXT.split('Política de Privacidad')[0]}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTerms(true);
            }}
            className="text-green-ink font-semibold hover:underline inline underline-offset-2"
          >
            Política de Privacidad
          </button>
          {CONSENT_TEXT.split('Política de Privacidad')[1]}
        </span>
      </label>

      <span id="consentError" role="alert" className={cn('text-xs text-destructive', consentError ? 'visible' : 'hidden')}>
        {consentError}
      </span>

      {/* In-Modal Viewable Terms Drawer */}
      {showTerms && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-drawer-title"
          className="absolute inset-0 z-20 bg-white rounded-2xl p-5 flex flex-col justify-between border border-border shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-navy font-bold text-sm">
              <ShieldCheckIcon size={18} className="text-green-ink" />
              <h3 id="terms-drawer-title">Política de Tratamiento de Datos</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              aria-label="Cerrar términos"
              className="p-1 rounded-lg text-muted-2 hover:bg-bg-soft hover:text-navy transition-colors"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs text-muted-foreground leading-relaxed pr-1">
            <p>
              <strong className="text-navy font-semibold">1. Marco Legal:</strong> Credalia trata sus datos personales de acuerdo con la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás normas que la modifiquen o complementen.
            </p>
            <p>
              <strong className="text-navy font-semibold">2. Finalidad del Tratamiento:</strong> Los datos recolectados se utilizarán exclusivamente para: (i) validar su identidad, (ii) evaluar el perfil crediticio y capacidad de pago, (iii) gestionar el desembolso a la cuenta indicada, y (iv) prevenir el fraude y suplantación de identidad.
            </p>
            <p>
              <strong className="text-navy font-semibold">3. Seguridad y Confidencialidad:</strong> Toda la información viaja cifrada con estándares bancarios (TLS 1.3 / AES-256) y no es compartida con terceros no autorizados.
            </p>
            <p>
              <strong className="text-navy font-semibold">4. Derechos del Titular:</strong> Usted tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales a través de nuestros canales oficiales de atención.
            </p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
            <a
              href="/legal/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-2 hover:text-navy underline"
            >
              Ver documento completo ↗
            </a>
            <button
              type="button"
              onClick={() => {
                setConsent(true);
                setConsentError('');
                setShowTerms(false);
              }}
              className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-deep transition-colors"
            >
              Entendido y autorizar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

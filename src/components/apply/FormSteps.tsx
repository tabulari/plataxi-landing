'use client';

import { useState, useRef, useEffect } from 'react';
import * as FocusScope from '@radix-ui/react-focus-scope';
import { fmtCOP } from '@/lib/credit';
import {
  CONSENT_TEXT,
  EMPLOYMENT_TYPES,
  type FieldName,
} from '@/lib/application-schema';
import { capFreq, type Values } from './use-application-form';
import { cn } from '@/lib/utils';
import { CloseIcon, ShieldCheckIcon } from '../icons';
import { FieldError } from '../FieldError';

type FieldHandlers = {
  onFieldChange: (name: FieldName, raw: string) => void;
  onFieldBlur: (name: FieldName, value: string) => void;
  errors: Partial<Record<FieldName, string>>;
};

const fieldEl = (name: FieldName, label: string, handlers: FieldHandlers, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
  const { className, ...rest } = props;
  return (
    <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_input]:border-destructive')}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        name={name}
        onChange={(e) => handlers.onFieldChange(name, e.target.value)}
        onBlur={(e) => handlers.onFieldBlur(name, (e.target as HTMLInputElement).value)}
        aria-invalid={handlers.errors[name] ? true : undefined}
        aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
        className={cn(
          'h-11 min-h-[44px] w-full rounded-xl border border-gray-300 bg-white px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] placeholder:text-muted-foreground focus:border-primary-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
          className,
        )}
        {...rest}
      />
      <FieldError id={`err-${name}`} message={handlers.errors[name]} />
    </label>
  );
};

const selectEl = (name: FieldName, label: string, placeholder: string, options: readonly string[], handlers: FieldHandlers, value: string) => (
  <label className={cn('flex flex-col gap-1.5', handlers.errors[name] && '[&_select]:border-destructive')}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <select
      name={name}
      value={value}
      onChange={(e) => { handlers.onFieldChange(name, e.target.value); }}
      aria-invalid={handlers.errors[name] ? true : undefined}
      aria-describedby={handlers.errors[name] ? `err-${name}` : undefined}
      className="h-11 min-h-[44px] w-full rounded-xl border border-gray-300 bg-white px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] focus:border-primary-brand"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <FieldError id={`err-${name}`} message={handlers.errors[name]} />
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

  const stepRef = useRef<HTMLElement>(null);
  const [showPhone2, setShowPhone2] = useState(() => !!values.phone2);
  // GSAP removido temporalmente — el modal ya anima, este stagger dejaba el step en blanco cuando el modal estaba oculto al montar

  return (
    <section ref={stepRef} className="flex-1 flex flex-col gap-5">
      <div className="h-1 bg-muted rounded-full overflow-hidden -mx-1">
        <div className="h-full bg-green transition-all duration-500 ease-out" style={{ width: '33%' }} />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase text-green-ink">Paso 1 de 3</p>
        <h2 className="text-[clamp(1.125rem,4vw,1.25rem)] font-bold text-navy tracking-tight" aria-label="Paso 1: Datos personales y de contacto">
          Cuéntanos de ti
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <ShieldCheckIcon size={14} aria-hidden="true" className="text-green-ink shrink-0" />
          Tus datos van cifrados. Solo los usamos para tu crédito.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {fieldEl('fullName', 'Tu nombre completo', handlers, {
          type: 'text',
          autoComplete: 'name',
          enterKeyHint: 'next',
          placeholder: 'Ej. Laura Martínez',
          value: values.fullName,
          className: 'h-[52px] text-[15px] font-medium',
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fieldEl('idNumber', 'Cédula', handlers, {
          type: 'text',
          inputMode: 'numeric',
          autoComplete: 'off',
          spellCheck: false,
          enterKeyHint: 'next',
          placeholder: 'Ej. 1.024.567.890',
          value: values.idNumber,
          onChange: (e) => handlers.onFieldChange('idNumber', formatCedula(e.target.value)),
        })}
        {fieldEl('phone', 'Tu número principal', handlers, {
          type: 'tel',
          inputMode: 'numeric',
          autoComplete: 'tel',
          enterKeyHint: 'next',
          placeholder: 'Ej. 300 123 4567',
          value: values.phone,
          onChange: (e) => handlers.onFieldChange('phone', formatPhone(e.target.value)),
        })}
      </div>

      {!showPhone2 ? (
        <button
          type="button"
          onClick={() => setShowPhone2(true)}
          className="self-start text-xs font-semibold text-green-ink hover:text-navy underline underline-offset-2 min-h-[44px] px-2 py-2 -ml-2 -mt-1 active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          + Agregar teléfono secundario
        </button>
      ) : (
        <div className="motion-safe:animate-step-in">
          {fieldEl('phone2', '¿Otro número donde ubicarte?', handlers, {
            type: 'tel',
            inputMode: 'numeric',
            autoComplete: 'tel',
            enterKeyHint: 'next',
            placeholder: 'Ej. 300 765 4321 — opcional',
            value: values.phone2 || '',
            onChange: (e) => handlers.onFieldChange('phone2', formatPhone(e.target.value)),
          })}
        </div>
      )}

        {fieldEl('email', 'Correo', handlers, {
        type: 'email',
        autoComplete: 'email',
        spellCheck: false,
        enterKeyHint: 'next',
        placeholder: 'tucorreo@ejemplo.com',
        value: values.email,
      })}
    </section>
  );
}

export function Step2({ values, handlers }: { values: Values; handlers: FieldHandlers }) {
  const formatIncome = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return fmtCOP(parseInt(digits, 10));
  };

  const stepRef = useRef<HTMLElement>(null);

  return (
    <section ref={stepRef} className="flex-1 flex flex-col gap-5">
      <div className="h-1 bg-muted rounded-full overflow-hidden -mx-1">
        <div className="h-full bg-green transition-all duration-500 ease-out" style={{ width: '66%' }} />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase text-green-ink">Paso 2 de 3</p>
        <h2 className="text-[clamp(1.125rem,4vw,1.25rem)] font-bold text-navy tracking-tight" aria-label="Paso 2: Tu taxi y tus ingresos">
          Tu taxi y tus ingresos
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">2 datos para validar tu capacidad de pago.</p>
      </div>

      {selectEl('employmentType', '¿Cuál es tu rol en el taxi?', 'Selecciona tu rol', EMPLOYMENT_TYPES, handlers, values.employmentType)}

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">¿Cuánto ganas? Elige cómo prefieres contarlo</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handlers.onFieldChange('incomeType', 'daily')}
            aria-pressed={values.incomeType === 'daily'}
            className={cn(
              'h-11 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98]',
              values.incomeType === 'daily'
                ? 'bg-green border-green text-ink shadow-sm'
                : 'bg-white border-gray-300 text-foreground hover:border-primary-brand',
            )}
          >
            Diario
          </button>
          <button
            type="button"
            onClick={() => handlers.onFieldChange('incomeType', 'monthly')}
            aria-pressed={values.incomeType === 'monthly'}
            className={cn(
              'h-11 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98]',
              values.incomeType === 'monthly'
                ? 'bg-green border-green text-ink shadow-sm'
                : 'bg-white border-gray-300 text-foreground hover:border-primary-brand',
            )}
          >
            Mensual
          </button>
        </div>
        <FieldError id="err-incomeType" message={handlers.errors.incomeType} />
      </div>

      {fieldEl('income', values.incomeType === 'daily' ? '¿Cuánto ganas al día?' : '¿Cuánto ganas al mes? (aprox)', handlers, {
        type: 'text',
        inputMode: 'numeric',
        enterKeyHint: 'done',
        placeholder: values.incomeType === 'daily' ? 'Ej. 80.000' : 'Ej. 2.500.000',
        value: values.income,
        onChange: (e) => handlers.onFieldChange('income', formatIncome(e.target.value)),
      })}

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-green/5 border border-green/20 rounded-xl px-3.5 py-3">
        <ShieldCheckIcon size={16} aria-hidden="true" className="text-green-ink shrink-0 mt-0.5" />
        <p className="leading-relaxed">La cuenta donde te consignamos la defines después, cuando estés aprobado — en tu espacio seguro.</p>
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
  const stepRef = useRef<HTMLElement>(null);
  const termsCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!showTerms) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTerms(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showTerms]);
  useEffect(() => {
    if (showTerms) termsCloseRef.current?.focus();
  }, [showTerms]);

  const reviewRows: { k: string; v: string; full?: boolean }[] = [
    { k: 'Monto solicitado', v: `$${fmtCOP(frozen.amount)} COP` },
    { k: 'Cuota estimada', v: `$${fmtCOP(frozen.payment)} ${frozen.unit}` },
    { k: 'Plazo', v: `${frozen.term} meses (${capFreq(frozen.frequency as 'daily' | 'weekly' | 'biweekly' | 'monthly')})` },
    { k: 'Nombre completo', v: values.fullName || '—', full: true },
    { k: 'Cédula de ciudadanía', v: values.idNumber || '—' },
    { k: 'Teléfono', v: values.phone || '—' },
    ...(values.phone2 ? [{ k: 'Teléfono secundario', v: values.phone2 }] : []),
    { k: 'Correo electrónico', v: values.email || '—', full: true },
    { k: 'Actividad laboral', v: values.employmentType || '—' },
    { k: 'Cuenta de desembolso', v: values.bank ? `${values.bank}${values.accountNumber ? ` - ${values.accountNumber}` : ''}` : 'Se define tras aprobación', full: !values.bank ? true : undefined },
  ];

  return (
    <section ref={stepRef} className="flex-1 flex flex-col gap-5 relative" inert={showTerms ? true as unknown as undefined : undefined}>
      <div className="h-1 bg-muted rounded-full overflow-hidden -mx-1">
        <div className="h-full bg-green transition-all duration-500 ease-out" style={{ width: '100%' }} />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase text-green-ink">Paso 3 de 3</p>
        <h2 className="text-[clamp(1.125rem,4vw,1.25rem)] font-bold text-navy tracking-tight" aria-label="Paso 3: ¿Todo bien?">
          ¿Todo bien? Revisa y envía
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Un último vistazo antes de mandar tu solicitud.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-xl border border-border/80 text-xs">
        {reviewRows.map(({ k, v, full }) => (
          <div key={k} className={cn('flex flex-col gap-1 min-w-0', full && 'col-span-2')}>
            <span className="text-muted-2 font-medium">{k}</span>
            <span className="font-semibold text-navy text-[clamp(0.75rem,2.5vw,0.875rem)] break-words">{v}</span>
          </div>
        ))}
      </div>

      <label className="flex gap-3 items-start text-xs sm:text-sm cursor-pointer min-h-[44px] py-2 -m-2 p-2 rounded-lg">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'consentError' : undefined}
          onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(''); }}
          className="mt-0.5 accent-green w-5 h-5 rounded shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

      <FieldError
        id="consentError"
        message={consentError}
        reserveSpace={false}
        className={cn(consentError ? 'flex' : 'hidden')}
      />

      {/* In-Modal Viewable Terms Drawer — focus trap + Esc + inert behind */}
      {showTerms && (
        <FocusScope.Root trapped loop onMountAutoFocus={(e) => { e.preventDefault(); termsCloseRef.current?.focus(); }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-drawer-title"
            className="absolute inset-0 z-20 bg-white rounded-2xl p-5 flex flex-col justify-between border border-border shadow-lg animate-terms-in dark:bg-[#1a1a18] dark:border-white/10"
          >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-navy font-bold text-sm">
              <ShieldCheckIcon size={18} className="text-green-ink" />
              <h3 id="terms-drawer-title">Política de Tratamiento de Datos</h3>
            </div>
            <button
              ref={termsCloseRef}
              type="button"
              onClick={() => setShowTerms(false)}
              aria-label="Cerrar términos"
              className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] -mr-2 rounded-xl text-muted-2 hover:bg-muted hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs text-muted-foreground leading-relaxed pr-1 overscroll-contain">
            <p>
              <strong className="text-navy font-semibold">1. Marco Legal:</strong> Plataxi trata sus datos personales de acuerdo con la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás normas que la modifiquen o complementen.
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
              className="px-4 py-2 min-h-[44px] rounded-xl bg-green text-ink font-bold hover:bg-green-bright border-0 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              Entendido y autorizar
            </button>
          </div>
          </div>
        </FocusScope.Root>
      )}
    </section>
  );
}

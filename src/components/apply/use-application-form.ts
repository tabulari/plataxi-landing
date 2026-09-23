'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fmtCOP, calculatePayment, type Simulation } from '@/lib/credit';
import { config } from '@/lib/config';
import {
  CONSENT_MESSAGE,
  STEP_FIELDS,
  validateField,
  type FieldName,
  type SubmitErrorCode as ErrorCode,
} from '@/lib/application-schema';
import { track } from '@/lib/analytics';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  saveSubmittedApplication,
  loadSubmittedApplication,
  clearSubmittedApplication,
} from '@/lib/draft-storage';

export type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';
export type SubmitErrorCode = ErrorCode | null;
export type Values = Record<FieldName, string>;

export const FIELDS: FieldName[] = [
  'fullName', 'idNumber', 'phone', 'contactName', 'contactPhone', 'email',
  'taxiRole', 'taxiPlate', 'taxiCompany', 'drivingTime',
  'income', 'incomeType', 'hasBank', 'bankEntity',
];

export const STEP_TITLES: Record<number, string> = {
  1: 'Tus datos',
  2: 'Tus ingresos',
  3: 'Revisión',
};

export const emptyValues: Values = {
  fullName: '', idNumber: '', phone: '', contactName: '', contactPhone: '', email: '',
  taxiRole: '', taxiPlate: '', taxiCompany: '', drivingTime: '',
  income: '', incomeType: 'monthly', hasBank: '', bankEntity: '',
};

export const capFreq = (f: Simulation['frequency']) =>
  f === 'daily' ? 'Diario'
  : f === 'weekly' ? 'Semanal'
  : f === 'biweekly' ? 'Quincenal'
  : f === 'bimonthly' ? 'Bimestral (est.)'
  : f === 'quarterly' ? 'Trimestral (est.)'
  : 'Mensual';

export function useApplicationForm(modalRef: React.RefObject<HTMLDivElement | null>) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [consentError, setConsentError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitErrorCode, setSubmitErrorCode] = useState<SubmitErrorCode>(null);
  const [radicado, setRadicado] = useState('');
  const [workspaceUrl, setWorkspaceUrl] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);

  const onFieldChange = useCallback((name: FieldName, raw: string) => {
    let v = raw;
    if (name === 'income') {
      const d = raw.replace(/\D/g, '');
      v = d ? `$ ${fmtCOP(parseInt(d, 10))}` : '';
    } else if (name === 'idNumber') {
      const d = raw.replace(/\D/g, '').slice(0, 10);
      v = d ? fmtCOP(parseInt(d, 10)) : '';
    } else if (name === 'phone' || name === 'contactPhone') {
      const d = raw.replace(/\D/g, '').slice(0, 10);
      if (d.length <= 3) {
        v = d;
      } else if (d.length <= 6) {
        v = `${d.slice(0, 3)} ${d.slice(3)}`;
      } else {
        v = `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
      }
    }
    setValues((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => prev[name] ? { ...prev, [name]: '' } : prev);
  }, []);

  const onFieldBlur = useCallback((name: FieldName, value: string) => {
    if (value.trim() !== '')
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const validateStep = useCallback((n: number): boolean => {
    const fields = STEP_FIELDS[n];
    if (fields) {
      const next: Partial<Record<FieldName, string>> = {};
      let firstBad: FieldName | null = null;
      for (const f of fields) {
        const msg = validateField(f, values[f]);
        next[f] = msg;
        if (msg && !firstBad) firstBad = f;
      }

      // Step 2 conditional: bankEntity required when hasBank = "yes"
      // hasBank = "no" always blocks (user cannot continue without a bank)
      if (n === 2) {
        if (values.hasBank === 'no') {
          next.hasBank = 'Necesitas una entidad bancaria para continuar.';
          if (!firstBad) firstBad = 'hasBank';
        } else if (values.hasBank === 'yes' && !values.bankEntity?.trim()) {
          next.bankEntity = 'Elige tu entidad bancaria.';
          if (!firstBad) firstBad = 'bankEntity';
        }
      }

      setErrors((prev) => ({ ...prev, ...next }));
      if (firstBad) {
        // The bank combobox input is named "bank" while its field key is bankEntity.
        const inputName = firstBad === 'bankEntity' ? 'bank' : firstBad;
        modalRef.current?.querySelector<HTMLElement>(`[name="${inputName}"]`)?.focus();
        return false;
      }
      return true;
    }
    // Step 3 = consent validation
    if (n === 3) {
      if (!consent) {
        setConsentError(CONSENT_MESSAGE);
        modalRef.current?.querySelector<HTMLInputElement>('input[name="consent"]')?.focus();
        return false;
      }
      setConsentError('');
      return true;
    }
    return true;
  }, [values, consent, modalRef]);

  const submit = useCallback(async (frozen: Simulation | null) => {
    if (!frozen) return;
    setSubmitStatus('pending');
    track('apply_submit', { amount: frozen.amount, term: frozen.term, frequency: frozen.frequency });
    const payload = { ...values, consent, terms: frozen };
    setSubmitErrorCode(null);
    let code: SubmitErrorCode = null;
    try {
      const res = await fetch('/api/application', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as { code?: ErrorCode } | null;
        code = res.status === 429 ? 'rate_limited' : (errBody?.code ?? 'connection');
        throw new Error(`submit failed (${res.status})`);
      }
      const data = (await res.json()) as { radicado: string; workspaceUrl?: string | null };
      const now = Date.now();
      setRadicado(data.radicado);
      setWorkspaceUrl(data.workspaceUrl ?? null);
      setSubmittedAt(now);
      clearDraft();
      saveSubmittedApplication({
        radicado: data.radicado,
        workspaceUrl: data.workspaceUrl ?? null,
        submittedAt: now,
        values,
        terms: frozen,
      });
      setSubmitStatus('success');
      track('apply_submit_success', { radicado: data.radicado });
    } catch {
      // A thrown fetch (offline, DNS) never reaches the status branch above.
      code ??= 'connection';
      setSubmitStatus('error');
      setSubmitErrorCode(code);
      track('apply_submit_error', { code });
    }
  }, [values, consent]);

  const onNext = useCallback((frozen: Simulation | null) => {
    if (!validateStep(step)) return;
    track('apply_step_complete', { step });
    if (step === 3) submit(frozen);
    else setStep((s) => s + 1);
  }, [step, validateStep, submit]);

  const restoreDraft = useCallback((onRestoredSubmission?: (terms: Simulation) => void, allowSubmitted: boolean = true): boolean => {
    const submitted = loadSubmittedApplication();
    if (allowSubmitted && submitted && submitted.radicado) {
      setRadicado(submitted.radicado);
      setWorkspaceUrl(submitted.workspaceUrl ?? null);
      setSubmittedAt(submitted.submittedAt ?? null);
      setValues((prev) => ({ ...prev, ...(submitted.values as Values) }));
      setConsent(true);
      setStep(3);
      setSubmitStatus('success');
      setSubmitErrorCode(null);
      if (onRestoredSubmission && submitted.terms) {
        const t = submitted.terms as Simulation;
        // Reprice with the rates frozen at submit time, not today's defaults, so
        // the resumed panel shows the same cuota Core recorded.
        const fresh = calculatePayment(
          t.amount,
          t.term,
          t.frequency,
          t.monthlyRate ?? config.credit.monthlyRate,
          t.acceptsPlatform ?? (t.platformFeeAmount ? t.platformFeeAmount > 0 : false),
          t.acceptsGuarantee ?? (t.guaranteeFeeAmount ? t.guaranteeFeeAmount > 0 : false),
          t.platformFeeRate ?? config.credit.platformFeeRate,
          t.guaranteeFeeRate ?? config.credit.guaranteeFeeRate,
        );
        onRestoredSubmission(fresh);
      }
      return true;
    }

    let draft: { step?: number } & Partial<Values> & { consent?: boolean } = {};
    const loaded = loadDraft() as { step?: number } & Partial<Values> & { consent?: boolean } | null;
    if (loaded) draft = loaded;

    const fallbackValues = submitted?.values ? (submitted.values as Partial<Values>) : {};
    const restored = { ...emptyValues };
    for (const f of FIELDS) {
      if (draft[f]) {
        restored[f] = draft[f] as string;
      } else if (fallbackValues[f]) {
        restored[f] = fallbackValues[f] as string;
      }
    }
    setValues(restored);
    setConsent(!!draft.consent);
    setStep(draft.step && draft.step >= 1 && draft.step <= 3 ? draft.step : 1);
    setErrors({});
    setConsentError('');
    setSubmitStatus('idle');
    setSubmitErrorCode(null);
    setRadicado('');
    setWorkspaceUrl(null);
    setSubmittedAt(null);
    return false;
  }, []);

  /** Jump to a completed step. From the error panel this returns to the form so the applicant can edit. */
  const goToStep = useCallback((n: number) => {
    setStep(n);
    setSubmitStatus((s) => (s === 'error' ? 'idle' : s));
    setSubmitErrorCode(null);
  }, []);

  const resetForm = useCallback(() => {
    setStep(1);
    setValues(emptyValues);
    setConsent(false);
    setErrors({});
    setConsentError('');
    setSubmitStatus('idle');
    setSubmitErrorCode(null);
    setRadicado('');
    setWorkspaceUrl(null);
    setSubmittedAt(null);
  }, []);

  const startNewApplication = useCallback(() => {
    clearSubmittedApplication();
    clearDraft();
    resetForm();
  }, [resetForm]);

  const isStepComplete = useMemo((): boolean => {
    if (step === 1) {
      return (
        validateField('fullName', values.fullName) === '' &&
        validateField('idNumber', values.idNumber) === '' &&
        validateField('phone', values.phone) === '' &&
        validateField('contactName', values.contactName) === '' &&
        validateField('contactPhone', values.contactPhone) === '' &&
        validateField('email', values.email) === ''
      );
    }
    if (step === 2) {
      return (
        validateField('income', values.income) === '' &&
        values.hasBank === 'yes' &&
        values.bankEntity.trim().length > 0
      );
    }
    if (step === 3) return consent;
    return true;
  }, [step, values, consent]);

  return {
    step, setStep, goToStep,
    values, onFieldChange, onFieldBlur,
    consent, setConsent,
    errors, consentError, setConsentError,
    submitStatus, submitErrorCode, radicado, workspaceUrl, submittedAt,
    onNext, submit,
    restoreDraft, resetForm, startNewApplication,
    isStepComplete,
  };
}

export function useDraftAutoSave(
  mounted: boolean,
  values: Values,
  consent: boolean,
  step: number,
  submitStatus: SubmitStatus,
) {
  useEffect(() => {
    if (!mounted || submitStatus === 'success') return;
    const hasContent = FIELDS.some((f) => values[f]) || consent;
    if (hasContent) saveDraft({ step, ...values, consent });
  }, [values, consent, step, mounted, submitStatus]);
}

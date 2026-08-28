'use client';

import { useCallback, useEffect, useState } from 'react';
import { fmtCOP, type Simulation } from '@/lib/credit';
import {
  CONSENT_MESSAGE,
  STEP_FIELDS,
  validateField,
  type FieldName,
} from '@/lib/application-schema';
import { track } from '@/lib/analytics';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft-storage';

export type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';
/** Machine-readable reason for a failed submit — mirrors the route's `code` field. */
export type SubmitErrorCode =
  | 'rate_limited' // 429 — too many requests, show wait hint
  | 'backend' // 502 — Core upstream rejected/errored, not the user's connection
  | 'connection' // network/other — genuinely can't reach the route
  | null;
export type Values = Record<FieldName, string>;

export const FIELDS: FieldName[] = [
  'fullName', 'idNumber', 'phone', 'email', 'employmentType', 'income', 'bank',
];

export const STEP_TITLES: Record<number, string> = {
  1: 'Tus datos',
  2: 'Tus ingresos',
  3: 'Revisión',
};

export const emptyValues: Values = {
  fullName: '', idNumber: '', phone: '', email: '',
  employmentType: '', income: '', bank: '',
};

export const capFreq = (f: Simulation['frequency']) =>
  f === 'biweekly' ? 'Quincenal' : 'Mensual';

export function useApplicationForm(modalRef: React.RefObject<HTMLDivElement | null>) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(emptyValues);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [consentError, setConsentError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitErrorCode, setSubmitErrorCode] = useState<SubmitErrorCode>(null);
  const [radicado, setRadicado] = useState('');

  const onFieldChange = useCallback((name: FieldName, raw: string) => {
    let v = raw;
    if (name === 'income') {
      const d = raw.replace(/\D/g, '');
      v = d ? `$ ${fmtCOP(parseInt(d, 10))}` : '';
    } else if (name === 'idNumber') {
      const d = raw.replace(/\D/g, '').slice(0, 10);
      v = d ? fmtCOP(parseInt(d, 10)) : '';
    } else if (name === 'phone') {
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
      setErrors((prev) => ({ ...prev, ...next }));
      if (firstBad) {
        modalRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
        return false;
      }
      return true;
    }
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
    // Hoisted so both the try and catch can read the reason for the failure.
    let code: SubmitErrorCode = null;
    try {
      const forceError = typeof window !== 'undefined' && (window as unknown as { __forceApplicationError?: boolean }).__forceApplicationError;
      const res = await fetch(`/api/application${forceError ? '?forceError=1' : ''}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Read the route's machine-readable `code` so the error panel can tell a
        // rate-limit / backend failure apart from a genuine connection problem.
        try {
          const errBody = (await res.json()) as { code?: SubmitErrorCode } | null;
          code = errBody?.code ?? (res.status === 429 ? 'rate_limited' : 'connection');
        } catch {
          code = res.status === 429 ? 'rate_limited' : 'connection';
        }
        if (res.status === 429) code = 'rate_limited';
        throw new Error(`submit failed (${res.status})`);
      }
      const data = (await res.json()) as { radicado: string };
      setRadicado(data.radicado);
      clearDraft();
      setSubmitStatus('success');
      setSubmitErrorCode(null);
      track('apply_submit_success', { radicado: data.radicado });
    } catch {
      setSubmitStatus('error');
      setSubmitErrorCode((prev) => prev ?? code);
      track('apply_submit_error', { code });
    }
  }, [values, consent]);

  const onNext = useCallback((frozen: Simulation | null) => {
    if (!validateStep(step)) return;
    track('apply_step_complete', { step });
    if (step === 3) submit(frozen);
    else setStep((s) => s + 1);
  }, [step, validateStep, submit]);

  const restoreDraft = useCallback(() => {
    let draft: { step?: number } & Partial<Values> & { consent?: boolean } = {};
    const loaded = loadDraft() as { step?: number } & Partial<Values> & { consent?: boolean } | null;
    if (loaded) draft = loaded;
    const restored = { ...emptyValues };
    for (const f of FIELDS) if (draft[f]) restored[f] = draft[f] as string;
    setValues(restored);
    setConsent(!!draft.consent);
    setStep(draft.step && draft.step >= 1 && draft.step <= 3 ? draft.step : 1);
    setErrors({});
    setConsentError('');
    setSubmitStatus('idle');
    setSubmitErrorCode(null);
    setRadicado('');
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
  }, []);

  return {
    step, setStep,
    values, onFieldChange, onFieldBlur,
    consent, setConsent,
    errors, consentError, setConsentError,
    submitStatus, submitErrorCode, radicado,
    onNext, submit,
    restoreDraft, resetForm,
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

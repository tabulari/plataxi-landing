import type { Simulation } from './credit';

const DRAFT_KEY = 'plataxi_draft_v1';
const SUBMISSION_KEY = 'plataxi_submission_v1';

export interface SubmittedApplication {
  radicado: string;
  workspaceUrl?: string | null;
  submittedAt: number;
  values: Record<string, string>;
  terms: Simulation;
}

function encode(data: object): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch {
    return '';
  }
}

function decode(raw: string | null): object | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    return null;
  }
}

export function notifySubmissionChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('plataxi_submission_changed'));
  }
}

export function onSubmissionChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('plataxi_submission_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('plataxi_submission_changed', handler);
    window.removeEventListener('storage', handler);
  };
}

export function saveDraft(data: object): void {
  try {
    const encoded = encode(data);
    if (encoded && typeof window !== 'undefined') localStorage.setItem(DRAFT_KEY, encoded);
  } catch { /* storage unavailable */ }
}

export function loadDraft(): object | null {
  try {
    if (typeof window === 'undefined') return null;
    return decode(localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(DRAFT_KEY);
  } catch { /* */ }
}

export function saveSubmittedApplication(data: SubmittedApplication): void {
  try {
    const encoded = encode(data);
    if (encoded && typeof window !== 'undefined') {
      localStorage.setItem(SUBMISSION_KEY, encoded);
      notifySubmissionChange();
    }
  } catch { /* storage unavailable */ }
}

export function loadSubmittedApplication(): SubmittedApplication | null {
  try {
    if (typeof window === 'undefined') return null;
    return decode(localStorage.getItem(SUBMISSION_KEY)) as SubmittedApplication | null;
  } catch {
    return null;
  }
}

export function clearSubmittedApplication(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUBMISSION_KEY);
      notifySubmissionChange();
    }
  } catch { /* */ }
}


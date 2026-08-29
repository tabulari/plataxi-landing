const DRAFT_KEY = 'plataxi_draft_v1';

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

export function saveDraft(data: object): void {
  try {
    const encoded = encode(data);
    if (encoded) localStorage.setItem(DRAFT_KEY, encoded);
  } catch { /* storage unavailable */ }
}

export function loadDraft(): object | null {
  try {
    return decode(localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* */ }
}

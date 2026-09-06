import { describe, expect, it, beforeEach } from 'vitest';
import { calculatePayment } from '../credit';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  saveSubmittedApplication,
  loadSubmittedApplication,
  clearSubmittedApplication,
  type SubmittedApplication,
} from '../draft-storage';

describe('draft-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('draft storage', () => {
    it('saves, loads, and clears a draft', () => {
      expect(loadDraft()).toBeNull();

      const draft = { step: 2, fullName: 'Carlos Pérez', phone: '3001234567' };
      saveDraft(draft);

      expect(loadDraft()).toEqual(draft);

      clearDraft();
      expect(loadDraft()).toBeNull();
    });
  });

  describe('submitted application storage', () => {
    const mockSubmission: SubmittedApplication = {
      radicado: 'CR-2026-TEST1234',
      workspaceUrl: 'https://plataxi.co/s/mock-token',
      submittedAt: 1725500000000,
      values: {
        fullName: 'Carlos Pérez',
        idNumber: '1.020.304.050',
        phone: '300 123 4567',
        email: 'carlos@example.com',
        employmentType: 'independent',
        income: '$ 2.500.000',
        bank: 'Bancolombia',
      },
      terms: calculatePayment(500000, 12, 'monthly'),
    };

    it('saves, loads, and clears a submitted application', () => {
      expect(loadSubmittedApplication()).toBeNull();

      saveSubmittedApplication(mockSubmission);

      const loaded = loadSubmittedApplication();
      expect(loaded).toEqual(mockSubmission);
      expect(loaded?.radicado).toBe('CR-2026-TEST1234');
      expect(loaded?.workspaceUrl).toBe('https://plataxi.co/s/mock-token');
      expect(loaded?.terms.amount).toBe(500000);

      clearSubmittedApplication();
      expect(loadSubmittedApplication()).toBeNull();
    });

    it('maintains submitted application and draft in distinct keys', () => {
      const draft = { step: 1, fullName: 'Draft User' };
      saveDraft(draft);
      saveSubmittedApplication(mockSubmission);

      expect(loadDraft()).toEqual(draft);
      expect(loadSubmittedApplication()).toEqual(mockSubmission);

      clearDraft();
      expect(loadDraft()).toBeNull();
      expect(loadSubmittedApplication()).toEqual(mockSubmission);

      clearSubmittedApplication();
      expect(loadSubmittedApplication()).toBeNull();
    });
  });
});

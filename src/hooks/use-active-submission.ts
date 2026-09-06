'use client';

import { useState, useEffect } from 'react';
import {
  loadSubmittedApplication,
  onSubmissionChange,
  type SubmittedApplication,
} from '@/lib/draft-storage';

/**
 * Reactive hook to track any active loan application submitted by the user.
 * Subscribes to local storage changes (and cross-tab storage events) so UI
 * surfaces (Hero, Simulator, Nav) immediately stay in sync when a loan is
 * submitted, reviewed, or cleared.
 */
export function useActiveSubmission(): SubmittedApplication | null {
  const [submission, setSubmission] = useState<SubmittedApplication | null>(null);

  useEffect(() => {
    // Initial client-side read after hydration
    setSubmission(loadSubmittedApplication());

    // Subscribe to internal dispatch and cross-tab storage updates
    return onSubmissionChange(() => {
      setSubmission(loadSubmittedApplication());
    });
  }, []);

  return submission;
}

'use client';

import dynamic from 'next/dynamic';

const ApplyModal = dynamic(
  () => import('@/components/ApplyModal').then((m) => ({ default: m.ApplyModal })),
  { ssr: false },
);
const StickyPaymentBar = dynamic(
  () => import('@/components/StickyPaymentBar').then((m) => ({ default: m.StickyPaymentBar })),
  { ssr: false },
);

export function LandingOverlays() {
  return (
    <>
      <ApplyModal />
      <StickyPaymentBar />
    </>
  );
}

'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function GsapProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

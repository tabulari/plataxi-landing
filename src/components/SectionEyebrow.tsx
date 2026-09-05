import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** `dark` is for use on the filled dark CTA band. */
  variant?: 'default' | 'dark';
}

/**
 * Section eyebrow pill.
 *
 * Measured off indrive.com/es-co/money: 40px tall, fully rounded, 20px of
 * horizontal padding, 14–16px text — sentence case, NOT the uppercase
 * letter-spaced micro-label this replaces.
 *
 * inDrive's pill is #F4F3D8, a shade darker than its canvas. Here the canvas is
 * already the cream palette color, so the pill is white instead — same
 * separation, no additional color.
 */
export function SectionEyebrow({
  children,
  variant = 'default',
  className,
  ...rest
}: SectionEyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center h-10 px-5 rounded-pill text-sm md:text-base font-medium',
        variant === 'dark'
          ? 'bg-white/10 text-white'
          : 'bg-surface-card text-primary-dark',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

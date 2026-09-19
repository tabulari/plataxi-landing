'use client';

import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScrollButton({
  target,
  className,
  children,
  onClick,
  variant,
  size,
  ...rest
}: React.ComponentProps<typeof Button> & { target: string }) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e);
        if (target === '#simula') {
          track('sim_cta_click', { label: (e.target as HTMLElement).closest('button')?.textContent?.trim() });
        }
        const el = document.querySelector(target);
        if (el) {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
        }
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

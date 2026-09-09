import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand-colors';

interface IconProps {
  size?: number;
  className?: string;
}

export function ShieldCheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function LockIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LockKeyholeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </svg>
  );
}

export function CalendarIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function HelpIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function CheckIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PencilIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function LightningIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function HomeIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function DocumentIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function DocumentCheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

export function SearchCheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="m8 11 2 2 4-4" />
    </svg>
  );
}

export function VerifiedCircleIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="var(--green)" />
      <polyline points="16 9 10.5 15 8 12.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MinusIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function HamburgerIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

export function PersonIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IdCardIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <path d="M14 9h4M14 12h4M14 15h2" />
    </svg>
  );
}

export function CreditCardIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function CalculatorIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="14" />
      <line x1="16" y1="18" x2="16" y2="18" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="12" y1="18" x2="12" y2="18" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="8" y1="18" x2="8" y2="18" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
    </svg>
  );
}

export function DocUploadIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  );
}

export function RefreshCheckIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function BankIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  );
}

export function AlertCircleIcon({ size = 36, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function ReturnArrowIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 14 4 9 9 4" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.66 4.22 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export function SparklesIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export function UserIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function BoltIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/**
 * Plataxi horizontal lockup — inline SVG, fondo transparente.
 * variant='dark'  → tinta oscura de paleta sobre fondo claro (Nav, Hero)
 * variant='white' → blanco puro sobre fondo oscuro (Footer)
 * variant='color' → amarillo de marca + tipografía oscura
 */
export function PlataxiWordmark({
  variant = 'dark',
  height = 36,
  className,
}: {
  variant?: 'dark' | 'white' | 'color';
  height?: number;
  className?: string;
}) {
  const isotypeColor = variant === 'white' ? '#ffffff' : variant === 'color' ? BRAND.yellow : BRAND.dark;
  const textColor = variant === 'white' ? '#ffffff' : BRAND.dark;
  // Lockup box measured off the source art: isotype 0..370, wordmark from 423.
  const vw = 1242;
  const vh = 200;
  const w = Math.round((height / vh) * vw);

  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Plataxi"
      role="img"
      className={className}
    >
      {/* Isotipo Plataxi: taxi facetado oficial */}
      <polygon points="97,0 273,0 317,77 53,77" fill={isotypeColor} />
      <polygon points="0,98 62,98 95,148 28,148" fill={isotypeColor} />
      <polygon points="308,98 370,98 342,148 275,148" fill={isotypeColor} />
      <polygon points="95,148 275,148 242,198 128,198" fill={isotypeColor} />
      {/* Wordmark: contornos, no texto vivo. Antes era un <text> con
          font-family var(--font-jakarta), asi que se re-componia con la
          tipografia del body — se veia en Inter y la I final quedaba cortada
          fuera del viewBox. Los contornos no dependen de ninguna fuente. */}
      <g transform="translate(423,10) scale(0.333333) translate(0.000000,399.000000) scale(0.100000,-0.100000)" fill={textColor}>
        <path d="M775 3970 l-740 -5 0 -1965 0 -1965 454 -3 c257 -1 459 2 464 7 5 5
        8 244 7 550 -1 433 2 542 12 546 7 3 263 6 568 9 641 4 713 10 935 77 437 132
        792 435 923 789 266 724 4 1456 -633 1765 -275 134 -501 182 -900 191 -115 2
        -241 5 -280 7 -38 1 -403 0 -810 -3z m1259 -779 c340 -91 516 -305 516 -626 0
        -331 -219 -592 -544 -647 -83 -14 -992 -21 -1017 -7 -18 9 -19 32 -19 654 l0
        645 293 3 c472 6 688 0 771 -22z"/>
        <path d="M16603 3973 c-71 -4 -81 -14 -122 -113 -13 -30 -36 -82 -51 -115 -76
        -164 -140 -307 -140 -310 0 -3 -20 -48 -45 -101 -25 -52 -45 -97 -45 -99 0 -4
        -46 -105 -111 -243 -21 -46 -39 -85 -39 -88 0 -2 -12 -28 -26 -57 -14 -28 -43
        -95 -66 -147 -39 -92 -50 -117 -137 -303 -23 -49 -41 -90 -41 -92 0 -3 -16
        -39 -36 -82 -20 -42 -74 -163 -119 -267 -229 -529 -230 -529 -322 -726 -25
        -52 -67 -144 -93 -205 -53 -122 -95 -214 -146 -323 -19 -40 -34 -75 -34 -77 0
        -3 -20 -48 -45 -101 -25 -52 -45 -97 -45 -99 0 -3 -26 -60 -58 -127 -81 -170
        -106 -233 -99 -252 6 -15 52 -16 474 -14 l468 3 27 55 c15 30 55 123 88 205
        34 83 67 164 74 180 8 17 35 82 61 145 26 63 53 127 61 142 8 14 14 33 14 41
        0 8 9 26 21 41 l20 26 919 0 919 0 20 -26 c12 -15 21 -32 21 -38 0 -6 20 -59
        45 -119 53 -126 126 -303 165 -402 71 -179 94 -231 109 -242 27 -23 1903 -18
        1923 5 14 14 153 222 241 357 14 22 98 146 186 275 88 129 230 340 316 468
        155 230 182 260 199 215 6 -16 306 -466 365 -548 34 -47 270 -380 291 -411 64
        -93 164 -232 213 -297 l58 -77 527 2 527 3 -2 22 c-2 12 -22 49 -45 82 -148
        206 -246 341 -338 466 -120 163 -169 232 -330 467 -319 464 -468 667 -638 873
        -50 61 -92 118 -92 128 0 15 144 213 295 406 63 80 134 176 250 337 66 91 201
        276 300 409 99 134 238 326 310 427 71 100 149 207 173 236 24 30 41 60 38 68
        -7 18 -994 21 -1026 4 -11 -6 -50 -56 -88 -113 -188 -280 -518 -757 -652 -941
        -102 -139 -130 -171 -150 -171 -23 0 -91 93 -280 385 -65 100 -292 434 -353
        520 -34 47 -91 128 -128 180 -37 52 -79 107 -93 123 l-25 27 -513 -2 c-481 -3
        -513 -4 -516 -21 -3 -17 57 -111 292 -452 112 -163 174 -250 426 -595 63 -87
        171 -236 240 -331 69 -95 178 -244 243 -331 74 -100 117 -167 117 -182 0 -27
        -59 -114 -381 -558 -227 -314 -316 -439 -417 -587 -58 -86 -124 -182 -147
        -213 -22 -31 -56 -80 -75 -108 -19 -28 -66 -96 -105 -150 -38 -54 -94 -133
        -123 -174 -81 -116 -77 -119 -220 199 -22 50 -79 175 -126 278 -47 103 -86
        190 -86 192 0 3 -15 37 -34 77 -31 68 -131 285 -161 353 -45 101 -68 153 -91
        208 -14 34 -41 94 -59 132 -18 39 -58 131 -90 205 -32 74 -72 167 -90 205 -18
        39 -52 115 -75 170 -54 127 -90 204 -206 442 -52 106 -94 195 -94 197 0 3 -15
        38 -34 78 -18 40 -50 108 -69 150 -20 42 -48 105 -63 140 -25 59 -88 199 -156
        348 -38 81 -66 143 -111 243 -20 42 -42 79 -49 81 -17 6 -805 13 -885 9z m476
        -1061 c29 -70 56 -134 61 -143 6 -12 101 -234 159 -374 11 -25 64 -156 101
        -250 26 -65 97 -236 184 -447 41 -98 42 -104 20 -112 -9 -3 -284 -6 -611 -6
        l-596 0 6 33 c3 18 18 62 35 97 16 36 53 121 81 190 29 69 56 134 61 145 4 11
        19 47 31 80 13 33 27 64 31 70 4 5 8 15 8 22 0 7 13 41 29 75 16 35 56 131 91
        213 34 83 89 215 122 295 33 80 67 163 76 185 36 91 45 85 111 -73z"/>
        <path d="M4143 3958 c-8 -15 -11 -3905 -2 -3919 3 -5 602 -8 1475 -7 l1469 3
        3 369 c2 264 -1 373 -9 382 -10 12 -174 14 -989 14 -538 0 -985 3 -994 6 -15
        6 -16 153 -16 1573 0 1205 -3 1570 -12 1579 -18 18 -914 17 -925 0z"/>
        <path d="M8943 3951 c-10 -11 -36 -62 -57 -113 -40 -93 -119 -270 -193 -428
        -22 -47 -54 -114 -71 -150 -16 -36 -58 -123 -91 -193 -34 -71 -100 -219 -147
        -330 -48 -111 -101 -233 -119 -272 -44 -94 -86 -186 -125 -270 -17 -38 -40
        -88 -51 -111 -10 -22 -19 -43 -19 -47 0 -3 -15 -39 -34 -79 -62 -133 -133
        -291 -204 -458 -39 -91 -94 -214 -122 -275 -106 -226 -185 -401 -235 -520 -21
        -49 -42 -94 -46 -100 -4 -5 -26 -55 -49 -110 -39 -92 -69 -157 -170 -370 -20
        -44 -36 -83 -33 -87 2 -5 215 -8 472 -8 531 0 481 -9 521 90 12 30 32 78 45
        105 12 28 39 91 60 140 121 293 155 376 175 425 12 30 27 61 32 68 15 18 1861
        18 1876 0 5 -7 19 -35 30 -63 11 -27 55 -133 97 -235 42 -102 90 -219 107
        -260 17 -41 34 -84 39 -95 4 -11 20 -49 35 -85 14 -36 31 -71 36 -77 21 -25
        998 -18 998 7 0 11 -34 90 -75 176 -41 86 -75 158 -75 160 0 3 -44 96 -99 207
        -140 286 -291 604 -291 612 0 3 -20 48 -45 101 -25 52 -45 97 -45 99 0 3 -17
        42 -39 87 -21 46 -58 128 -81 183 -42 99 -111 252 -176 393 -19 40 -34 75 -34
        77 0 3 -14 35 -31 72 -17 38 -42 91 -54 118 -13 28 -39 85 -59 128 -20 42 -36
        80 -36 82 0 3 -40 89 -90 190 -49 101 -90 187 -90 190 0 5 -54 122 -120 260
        -21 44 -56 121 -78 170 -71 160 -128 288 -176 390 -26 55 -57 120 -68 145 -41
        87 7 80 -514 80 -445 0 -464 -1 -481 -19z m541 -1023 c27 -68 84 -208 128
        -313 44 -104 94 -224 110 -265 17 -41 34 -84 39 -95 61 -145 89 -215 89 -220
        0 -3 9 -24 19 -48 11 -23 43 -98 71 -167 29 -69 59 -141 67 -161 33 -80 81
        -74 -588 -77 -470 -2 -599 1 -607 10 -7 9 2 41 30 108 22 52 54 129 70 170 17
        41 36 89 43 105 8 17 89 208 180 425 92 217 173 409 180 425 44 101 75 179 75
        189 0 15 20 36 35 36 5 0 32 -55 59 -122z"/>
        <path d="M11523 3958 c-12 -16 -26 -707 -14 -726 6 -10 122 -13 552 -13 299 0
        576 -3 614 -7 l70 -7 5 -1585 5 -1585 459 -3 c287 -1 463 1 469 7 7 7 11 586
        12 1581 2 1181 6 1575 14 1583 14 14 -35 13 679 15 l582 2 -2 373 -3 372
        -1716 3 c-1366 2 -1719 -1 -1726 -10z"/>
        <path d="M23603 3958 c-9 -15 -5 -3815 4 -3866 11 -63 4 -62 489 -60 l439 3 0
        1965 0 1965 -462 3 c-363 2 -463 -1 -470 -10z"/>
      </g>
    </svg>
  );
}

export function BrandLogo({
  height = 32,
  className,
  style,
  monochrome = false,
  variant = 'default',
}: {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  monochrome?: boolean;
  variant?: 'default' | 'footer';
}) {
  const onDark = variant === 'footer';
  const textColor = monochrome ? 'currentColor' : onDark ? '#ffffff' : '#111110';
  const markBg = monochrome ? 'transparent' : BRAND.yellow;
  const markFg = monochrome ? 'currentColor' : '#111110';
  const markSize = Math.round(height);

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(height * 0.3), ...style }}
    >
      <span
        style={{
          width: markSize,
          height: markSize,
          borderRadius: Math.round(height * 0.28),
          background: markBg,
          color: markFg,
          border: monochrome ? '2px solid currentColor' : 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Math.round(height * 0.16),
        }}
      >
        <svg
          viewBox="0 0 370 200"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="97,0 273,0 317,77 53,77" fill={markFg} />
          <polygon points="0,98 62,98 95,148 28,148" fill={markFg} />
          <polygon points="308,98 370,98 342,148 275,148" fill={markFg} />
          <polygon points="95,148 275,148 242,198 128,198" fill={markFg} />
        </svg>
      </span>
      <span
        style={{
          fontFamily: "var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif",
          fontWeight: 900,
          fontSize: Math.round(height * 0.72),
          letterSpacing: '0.02em',
          color: textColor,
          lineHeight: 1,
        }}
      >
        PLATAXI
      </span>
    </span>
  );
}

/**
 * Plataxi brand mark — yellow squircle badge with the faceted taxi isotype.
 *
 * The badge is a superellipse (|x/a|^5 + |y/b|^5 = 1), not a rect with a corner
 * radius: a rounded rect changes curvature abruptly where the arc meets the
 * straight edge, while a superellipse is continuous, which is what reads as an
 * app icon. Geometry is kept byte-identical to public/plataxi-icon.svg so the
 * inline component and the standalone asset cannot drift.
 *
 * The isotype polygons are unchanged from the original mark — only scaled and
 * centred at 70% of badge width (the mark is 1.85:1, so it needs more width
 * than a tall glyph to carry the same optical weight).
 */
export function PlataxiLogo({ size = 48, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      style={{ height: 'auto', aspectRatio: '1 / 1' }}
    >
      <path fill={BRAND.yellow} d="M40.000 20.000C40.000 22.952 39.977 26.916 39.931 28.857C39.885 30.799 39.817 30.854 39.725 31.647C39.632 32.441 39.517 33.035 39.377 33.620C39.236 34.205 39.073 34.694 38.882 35.157C38.691 35.620 38.476 36.023 38.231 36.399C37.986 36.774 37.716 37.106 37.411 37.411C37.106 37.716 36.774 37.986 36.399 38.231C36.023 38.476 35.620 38.691 35.157 38.882C34.694 39.073 34.205 39.236 33.620 39.377C33.035 39.517 32.441 39.632 31.647 39.725C30.854 39.817 30.799 39.885 28.857 39.931C26.916 39.977 22.952 40.000 20.000 40.000C17.048 40.000 13.084 39.977 11.143 39.931C9.201 39.885 9.146 39.817 8.353 39.725C7.559 39.632 6.965 39.517 6.380 39.377C5.795 39.236 5.306 39.073 4.843 38.882C4.380 38.691 3.977 38.476 3.601 38.231C3.226 37.986 2.894 37.716 2.589 37.411C2.284 37.106 2.014 36.774 1.769 36.399C1.524 36.023 1.309 35.620 1.118 35.157C0.927 34.694 0.764 34.205 0.623 33.620C0.483 33.035 0.368 32.441 0.275 31.647C0.183 30.854 0.115 30.799 0.069 28.857C0.023 26.916 0.000 22.952 0.000 20.000C0.000 17.048 0.023 13.084 0.069 11.143C0.115 9.201 0.183 9.146 0.275 8.353C0.368 7.559 0.483 6.965 0.623 6.380C0.764 5.795 0.927 5.306 1.118 4.843C1.309 4.380 1.524 3.977 1.769 3.601C2.014 3.226 2.284 2.894 2.589 2.589C2.894 2.284 3.226 2.014 3.601 1.769C3.977 1.524 4.380 1.309 4.843 1.118C5.306 0.927 5.795 0.764 6.380 0.623C6.965 0.483 7.559 0.368 8.353 0.275C9.146 0.183 9.201 0.115 11.143 0.069C13.084 0.023 17.048 0.000 20.000 0.000C22.952 0.000 26.916 0.023 28.857 0.069C30.799 0.115 30.854 0.183 31.647 0.275C32.441 0.368 33.035 0.483 33.620 0.623C34.205 0.764 34.694 0.927 35.157 1.118C35.620 1.309 36.023 1.524 36.399 1.769C36.774 2.014 37.106 2.284 37.411 2.589C37.716 2.894 37.986 3.226 38.231 3.601C38.476 3.977 38.691 4.380 38.882 4.843C39.073 5.306 39.236 5.795 39.377 6.380C39.517 6.965 39.632 7.559 39.725 8.353C39.817 9.146 39.885 9.201 39.931 11.143C39.977 13.084 40.000 17.048 40.000 20.000Z" />
      <g fill={BRAND.dark}>
        <polygon points="13.341,12.432 26.659,12.432 29.989,18.259 10.011,18.259" />
        <polygon points="6.000,19.849 10.692,19.849 13.189,23.632 8.119,23.632" />
        <polygon points="29.308,19.849 34.000,19.849 31.881,23.632 26.811,23.632" />
        <polygon points="13.189,23.632 26.811,23.632 24.314,27.416 15.686,27.416" />
      </g>
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export { cn, type IconProps };

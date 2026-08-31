'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type LogoVariant = 'dark' | 'white' | 'color' | 'yellow' | 'yellow-white';
export type LogoLayout = 'horizontal' | 'with-tagline' | 'isotype-only' | 'vertical';

export interface PlataxiLogoProps {
  /** Visual color style:
   * - 'dark': #151515 dark ink (for white or light backgrounds)
   * - 'white': #FFFFFF pure white (for dark/footer backgrounds)
   * - 'color': Yellow #FFDD00 symbol + dark text
   * - 'yellow': Pure #FFDD00 for symbol and text
   * - 'yellow-white': Yellow #FFDD00 symbol + white text
   */
  variant?: LogoVariant;
  /** Layout arrangement */
  layout?: LogoLayout;
  /** Render height in pixels (width adjusts automatically preserving aspect ratio) */
  height?: number;
  /** Optional custom class names */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
}

/**
 * Geometric Isotype SVG Paths (ViewBox 370 x 200)
 */
export function PlataxiIsotypePath({ fill = 'currentColor' }: { fill?: string }) {
  return (
    <>
      {/* Top Roof / Hood Trapezoid */}
      <polygon points="97,0 273,0 317,77 53,77" fill={fill} />
      {/* Left Wing */}
      <polygon points="0,98 62,98 95,148 28,148" fill={fill} />
      {/* Right Wing */}
      <polygon points="308,98 370,98 342,148 275,148" fill={fill} />
      {/* Bottom Center Trapezoid */}
      <polygon points="95,148 275,148 242,198 128,198" fill={fill} />
    </>
  );
}

export function PlataxiLogo({
  variant = 'dark',
  layout = 'horizontal',
  height = 36,
  className,
  ariaLabel = 'Plataxi',
}: PlataxiLogoProps) {
  // Resolve colors based on variant
  let isotypeColor = '#111110';
  let textColor = '#111110';
  let taglineColor = '#111110';

  if (variant === 'white') {
    isotypeColor = '#ffffff';
    textColor = '#ffffff';
    taglineColor = '#ffffff';
  } else if (variant === 'color') {
    isotypeColor = '#f5e15b';
    textColor = '#111110';
    taglineColor = '#111110';
  } else if (variant === 'yellow') {
    isotypeColor = '#f5e15b';
    textColor = '#f5e15b';
    taglineColor = '#f5e15b';
  } else if (variant === 'yellow-white') {
    isotypeColor = '#f5e15b';
    textColor = '#ffffff';
    taglineColor = '#ffffff';
  }

  if (layout === 'isotype-only') {
    const vw = 370;
    const vh = 200;
    const width = Math.round((height / vh) * vw);

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${vw} ${vh}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        className={cn('inline-block shrink-0', className)}
      >
        <PlataxiIsotypePath fill={isotypeColor} />
      </svg>
    );
  }

  if (layout === 'with-tagline') {
    const vw = 1280;
    const vh = 230;
    const width = Math.round((height / vh) * vw);

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${vw} ${vh}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        className={cn('inline-block shrink-0', className)}
      >
        {/* Isotype (x: 0..370, y: 15..215) */}
        <g transform="translate(0, 15)">
          <PlataxiIsotypePath fill={isotypeColor} />
        </g>
        {/* Wordmark PLATAXI */}
        <text
          x="420"
          y="132"
          fontFamily="var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="138"
          letterSpacing="3"
          fill={textColor}
        >
          PLATAXI
        </text>
        {/* Tagline LIQUIDEZ PARA TU DÍA A DÍA */}
        <text
          x="422"
          y="196"
          fontFamily="var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif"
          fontWeight="800"
          fontSize="44"
          letterSpacing="5.5"
          fill={taglineColor}
        >
          LIQUIDEZ PARA TU DÍA A DÍA
        </text>
      </svg>
    );
  }

  if (layout === 'vertical') {
    const vw = 800;
    const vh = 600;
    const width = Math.round((height / vh) * vw);

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${vw} ${vh}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        className={cn('inline-block shrink-0', className)}
      >
        <g transform="translate(215, 60)">
          <PlataxiIsotypePath fill={isotypeColor} />
        </g>
        <text
          x="400"
          y="390"
          textAnchor="middle"
          fontFamily="var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="120"
          letterSpacing="4"
          fill={textColor}
        >
          PLATAXI
        </text>
        <text
          x="400"
          y="450"
          textAnchor="middle"
          fontFamily="var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif"
          fontWeight="800"
          fontSize="36"
          letterSpacing="4.5"
          fill={taglineColor}
        >
          LIQUIDEZ PARA TU DÍA A DÍA
        </text>
      </svg>
    );
  }

  // Default: Horizontal lockup (ideal for Navbar and Headers)
  const vw = 1050;
  const vh = 200;
  const width = Math.round((height / vh) * vw);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn('inline-block shrink-0', className)}
    >
      <g transform="translate(0, 0)">
        <PlataxiIsotypePath fill={isotypeColor} />
      </g>
      <text
        x="420"
        y="148"
        fontFamily="var(--font-jakarta), 'Montserrat', 'Roboto', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="150"
        letterSpacing="4"
        fill={textColor}
      >
        PLATAXI
      </text>
    </svg>
  );
}

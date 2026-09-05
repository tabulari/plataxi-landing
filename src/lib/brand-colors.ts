/**
 * The five Plataxi palette colors as literal values.
 *
 * CSS should always use the tokens in `src/app/globals.css`. This module exists
 * only for contexts that cannot read CSS custom properties — inline SVG
 * `fill`/`stroke` attributes, canvas, and manifest/OG image generation.
 *
 * It exists because the brand mark had drifted: the logo rendered one yellow,
 * the palette declared another, and the brand kit and favicon carried a third.
 * That is now resolved — every surface, asset and kit file is on the palette
 * value below. Import from here rather than retyping a hex, so it stays that
 * way.
 *
 * Keep in sync with the `--color-*` block in globals.css.
 */
export const BRAND = {
  /** Palette 1 — Dark Onyx. Structural / ink. */
  dark: '#111110',
  /** Palette 2 — Butter yellow. Brand accent and highlight. */
  yellow: '#f6d860',
  /** Palette 3 — Soft cream. Raised surface (cards, pills). Never the accent. */
  cream: '#fffbe0',
  /** Palette 4 — Mid gray. Not AA on cream; prefer the `-aa` CSS token for text. */
  grayText: '#757575',
  /** Palette 5 — Light gray. Borders and inactive marks. */
  grayBorder: '#c1c1c1',
} as const;

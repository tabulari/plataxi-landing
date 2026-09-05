import { test, expect } from "@playwright/test";

/**
 * Hero legibility gate.
 *
 * The hero is white text over a photograph. axe cannot evaluate this — it reads
 * `color` against `background-color`, sees `transparent` over an <img>, and
 * skips the node entirely. So the hero can silently fall below WCAG when the
 * photo is swapped, the scrim is retuned, or the copy colour changes, and every
 * other gate stays green.
 *
 * This measures the real thing: it hides the copy, screenshots the hero as the
 * browser actually composites it (photo + scrim), then samples the pixels the
 * copy would have covered. Nothing about the gradient is reimplemented here, so
 * a change to the scrim is caught the same as a change to the photo.
 *
 * Thresholds are WCAG 2.1 AA: 3:1 for large text, 4.5:1 for normal text.
 */

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

// A left-to-right scrim only holds while the copy sits in the left portion of
// the hero. At narrow widths the copy spans nearly the full width and runs off
// the dark end, so both widths must be checked — desktop alone would pass while
// mobile was failing at 2:1.
for (const vp of VIEWPORTS) {
  test(`hero copy meets WCAG AA over the photo (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");

    const hero = page.locator('section[aria-labelledby="hero-heading"]');
    await expect(hero).toBeVisible();
    await page.locator("h1#hero-heading").waitFor();

    // The photo must be decoded before anything is sampled. Without this the
    // check reads an unpainted hero and silently "passes" on a blank page.
    await page.waitForFunction(() => {
      const img = document.querySelector<HTMLImageElement>(
        'section[aria-labelledby="hero-heading"] img',
      );
      return !!img && img.complete && img.naturalWidth > 0;
    });

    // Let the entrance animation settle so bounding boxes are final.
    await page.waitForTimeout(1500);

    const targets = await page.evaluate(() => {
      const sec = document.querySelector<HTMLElement>(
        'section[aria-labelledby="hero-heading"]',
      )!;
      const secR = sec.getBoundingClientRect();
      const h1 = sec.querySelector<HTMLElement>("h1")!;
      const p = sec.querySelector<HTMLElement>("p")!;

      const describe = (el: HTMLElement, label: string, minRatio: number) => {
        const r = el.getBoundingClientRect();
        return {
          label,
          minRatio,
          color: getComputedStyle(el).color,
          box: {
            x: Math.round(r.left - secR.left),
            y: Math.round(r.top - secR.top),
            w: Math.round(r.width),
            h: Math.round(r.height),
          },
        };
      };

      // h1 is >=36px bold at every breakpoint, so it qualifies as large text.
      return [describe(h1, "hero h1", 3), describe(p, "hero paragraph", 4.5)];
    });

    // Hide the copy so the screenshot captures only photo + scrim.
    await page.evaluate(() => {
      const sec = document.querySelector<HTMLElement>(
        'section[aria-labelledby="hero-heading"]',
      )!;
      sec
        .querySelectorAll<HTMLElement>("h1, p, a, button")
        .forEach((el) => (el.style.visibility = "hidden"));
    });

    const shot = await hero.screenshot();
    const dataUrl = `data:image/png;base64,${shot.toString("base64")}`;

    const results = await page.evaluate(
      async ({ dataUrl, targets }) => {
        const img = new Image();
        img.src = dataUrl;
        await img.decode();

        const cv = document.createElement("canvas");
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;
        const ctx = cv.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);

        // The screenshot is in device pixels; boxes are in CSS pixels.
        const scale = img.naturalWidth / document.querySelector(
          'section[aria-labelledby="hero-heading"]',
        )!.getBoundingClientRect().width;

        const lin = (c: number) => {
          c /= 255;
          return c > 0.03928 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
        };
        const relL = (r: number, g: number, b: number) =>
          0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

        return targets.map((t) => {
          const parts = t.color.match(/[\d.]+/g)!.map(Number);
          const [tr, tg, tb] = parts;
          const ta = parts.length > 3 ? parts[3] : 1;

          const x0 = Math.max(0, Math.round(t.box.x * scale));
          const y0 = Math.max(0, Math.round(t.box.y * scale));
          const w = Math.min(cv.width - x0, Math.round(t.box.w * scale));
          const h = Math.min(cv.height - y0, Math.round(t.box.h * scale));
          if (w <= 0 || h <= 0)
            return { ...t, worst: 0, sampled: 0, nearWhiteRatio: 1 };

          const d = ctx.getImageData(x0, y0, w, h).data;
          let worst = Infinity;
          let nearWhite = 0;
          let pixels = 0;
          for (let i = 0; i < d.length; i += 4) {
            const R = d[i], G = d[i + 1], B = d[i + 2];
            const Lb = relL(R, G, B);
            // Composite the copy's own alpha over the background it sits on.
            const Lf = relL(
              tr * ta + R * (1 - ta),
              tg * ta + G * (1 - ta),
              tb * ta + B * (1 - ta),
            );
            const hi = Math.max(Lf, Lb), lo = Math.min(Lf, Lb);
            const ratio = (hi + 0.05) / (lo + 0.05);
            if (ratio < worst) worst = ratio;
            pixels++;
            if (R > 250 && G > 250 && B > 250) nearWhite++;
          }
          return {
            ...t,
            worst: Math.round(worst * 100) / 100,
            sampled: w * h,
            nearWhiteRatio: pixels ? nearWhite / pixels : 1,
          };
        });
      },
      { dataUrl, targets },
    );

    for (const r of results) {
      expect(r.sampled, `${r.label}: sampled no pixels`).toBeGreaterThan(0);

      // A hero that has not painted reads as a flat white field, which would
      // otherwise surface as a bogus ~1:1 "contrast failure". Fail as what it
      // actually is, so a genuine regression is never confused with a race.
      expect(
        r.nearWhiteRatio,
        `${r.label}: the hero sampled as ${Math.round(r.nearWhiteRatio * 100)}% ` +
          `pure white — the photo almost certainly had not painted. This is a ` +
          `test/environment problem, not a contrast regression.`,
      ).toBeLessThan(0.9);
      expect(
        r.worst,
        `${r.label} (${vp.name}): worst contrast ${r.worst}:1 over the hero ` +
          `photo, needs ${r.minRatio}:1. Retune the scrim in Hero.tsx or pick ` +
          `a darker image.`,
      ).toBeGreaterThanOrEqual(r.minRatio);
    }
  });
}

/**
 * Same gate, applied to the navigation bar.
 *
 * The bar is transparent over the hero photo with white links, so it has the
 * identical blind spot: axe sees `transparent` over an <img> and skips it. This
 * caught a real failure — the hero's own scrim runs left-to-right, so it is at
 * its thinnest exactly under the right-hand links, which measured 3.08:1.
 *
 * Only the top (transparent) state is at risk; once scrolled the bar paints a
 * solid background and axe covers it. Links are `hidden` below `md`, so this
 * runs at desktop only.
 */
test("transparent nav links meet WCAG AA over the hero photo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page.locator("header").waitFor();
  await page.waitForFunction(() => {
    const img = document.querySelector<HTMLImageElement>(
      'section[aria-labelledby="hero-heading"] img',
    );
    return !!img && img.complete && img.naturalWidth > 0;
  });
  await page.waitForTimeout(1500);

  const targets = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("header nav a")]
      .filter((a) => a.getBoundingClientRect().width > 0)
      .map((a) => {
        const r = a.getBoundingClientRect();
        return {
          label: (a.textContent || "").trim().slice(0, 24),
          color: getComputedStyle(a).color,
          box: {
            x: Math.round(r.x),
            y: Math.round(r.y),
            w: Math.round(r.width),
            h: Math.round(r.height),
          },
        };
      }),
  );
  expect(targets.length, "no visible nav links found to check").toBeGreaterThan(0);

  // Hide the bar's CONTENT but keep its scrim, so we sample what the text sits on.
  const hid = await page.evaluate(() => {
    const inner = document.querySelector<HTMLElement>("header > div.relative");
    if (!inner) return false;
    inner.style.visibility = "hidden";
    return true;
  });
  expect(hid, "could not isolate the nav bar content for sampling").toBe(true);

  const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 90 } });
  await page.evaluate(() => {
    const inner = document.querySelector<HTMLElement>("header > div.relative");
    if (inner) inner.style.visibility = "";
  });

  const results = await page.evaluate(
    async ({ dataUrl, targets }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const cv = document.createElement("canvas");
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      const ctx = cv.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);

      const lin = (c: number) => {
        c /= 255;
        return c > 0.03928 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
      };
      const relL = (r: number, g: number, b: number) =>
        0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

      return targets.map((t) => {
        const parts = t.color.match(/[\d.]+/g)!.map(Number);
        const [tr, tg, tb] = parts;
        const ta = parts.length > 3 ? parts[3] : 1;
        const x0 = Math.max(0, t.box.x);
        const y0 = Math.max(0, t.box.y);
        const w = Math.min(cv.width - x0, t.box.w);
        const h = Math.min(cv.height - y0, t.box.h);
        if (w <= 0 || h <= 0) return { label: t.label, worst: 0, nearWhiteRatio: 1 };

        const d = ctx.getImageData(x0, y0, w, h).data;
        let worst = Infinity;
        let nearWhite = 0;
        let pixels = 0;
        for (let i = 0; i < d.length; i += 4) {
          const R = d[i], G = d[i + 1], B = d[i + 2];
          const Lb = relL(R, G, B);
          const Lf = relL(
            tr * ta + R * (1 - ta),
            tg * ta + G * (1 - ta),
            tb * ta + B * (1 - ta),
          );
          const hi = Math.max(Lf, Lb), lo = Math.min(Lf, Lb);
          const ratio = (hi + 0.05) / (lo + 0.05);
          if (ratio < worst) worst = ratio;
          pixels++;
          if (R > 250 && G > 250 && B > 250) nearWhite++;
        }
        return {
          label: t.label,
          worst: Math.round(worst * 100) / 100,
          nearWhiteRatio: pixels ? nearWhite / pixels : 1,
        };
      });
    },
    { dataUrl: `data:image/png;base64,${shot.toString("base64")}`, targets },
  );

  for (const r of results) {
    expect(
      r.nearWhiteRatio,
      `nav link "${r.label}": sampled ${Math.round(r.nearWhiteRatio * 100)}% pure ` +
        `white — the hero photo had not painted. Test/environment problem, not a ` +
        `contrast regression.`,
    ).toBeLessThan(0.9);
    expect(
      r.worst,
      `nav link "${r.label}": worst contrast ${r.worst}:1 over the hero photo, ` +
        `needs 4.5:1. Strengthen the bar scrim in Nav.tsx.`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});

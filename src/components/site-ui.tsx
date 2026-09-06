"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { track } from "@/lib/analytics";

/**
 * Shared client UI state for cross-section overlays: the application modal
 * open intent (so every apply CTA routes through one seam).
 */

export type ApplyOrigin = "direct" | "simulator" | "resume" | "hiw" | "cta_banner";

interface SiteUi {
  applyOpen: boolean;
  applyOrigin: ApplyOrigin;
  openApply: (origin?: ApplyOrigin) => void;
  closeApply: () => void;
}

const SiteUiContext = createContext<SiteUi | null>(null);

export function SiteUiProvider({ children }: { children: React.ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyOrigin, setApplyOrigin] = useState<ApplyOrigin>("direct");

  const openApply = useCallback((origin: ApplyOrigin = "direct") => {
    setApplyOrigin(origin);
    setApplyOpen(true);
    track("apply_start", { origin });
  }, []);

  const closeApply = useCallback(() => setApplyOpen(false), []);

  const value = useMemo<SiteUi>(
    () => ({
      applyOpen,
      applyOrigin,
      openApply,
      closeApply,
    }),
    [
      applyOpen,
      applyOrigin,
      openApply,
      closeApply,
    ],
  );

  return (
    <SiteUiContext.Provider value={value}>{children}</SiteUiContext.Provider>
  );
}

export function useSiteUi(): SiteUi {
  const ctx = useContext(SiteUiContext);
  if (!ctx) throw new Error("useSiteUi must be used within <SiteUiProvider>");
  return ctx;
}

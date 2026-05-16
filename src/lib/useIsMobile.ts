"use client";

import { useEffect, useState } from "react";

/**
 * Tailwind's `md` breakpoint is 768px. The landing sections build their
 * scroll-driven cinematics with absolutely-positioned canvases and pin a
 * `<section id="…">` of a fixed vh height. Toggling those with CSS
 * `hidden`/`md:hidden` is NOT safe here: both variants would stay mounted,
 * producing duplicate element IDs and double the scroll runway, which
 * breaks ScrollTrigger math and the navbar scroll-spy.
 *
 * So Hero/Product pick ONE variant to mount via this hook instead.
 *
 * SSR returns `null` (unknown) on the first paint to avoid a hydration
 * mismatch; callers render nothing until the viewport is measured.
 */
export function useIsMobile(query = "(max-width: 767px)"): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [query]);

  return isMobile;
}

"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registers ScrollTrigger globally for client components.
 *
 * Lenis is intentionally NOT enabled here. Lenis virtualizes scroll
 * (sets overflow:hidden on <html>, moves content via transform) which
 * pins window.scrollY at 0 and breaks ScrollTrigger unless paired with
 * a careful scrollerProxy wiring. Native scroll is sufficient for the
 * cinematic; Lenis can be re-introduced later for the smoothing polish
 * once the core animation works end-to-end.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return <>{children}</>;
}

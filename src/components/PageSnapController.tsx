"use client";

import { useEffect, useRef } from "react";

const SNAP_IDS = ["importance", "product", "purpose"] as const;

function getSection(id: string) {
  return document.getElementById(id);
}

function getTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function isElement(section: HTMLElement | null): section is HTMLElement {
  return section !== null;
}

export function PageSnapController() {
  const lockedRef = useRef(false);
  const idleTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const getTops = () =>
      SNAP_IDS.map((id) => getSection(id)).filter(isElement).map((section) => ({
        id: section.id,
        top: getTop(section),
      }));

    const snapTo = (top: number) => {
      lockedRef.current = true;
      window.scrollTo({ top, behavior: "smooth" });
      window.setTimeout(() => {
        lockedRef.current = false;
      }, 720);
    };

    const handleWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) < 8) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a, form")) return;

      const sections = getTops();
      const product = sections.find((section) => section.id === "product");
      const purpose = sections.find((section) => section.id === "purpose");
      if (!product || !purpose) return;

      const productFrame = Number(document.documentElement.dataset.productFrame ?? "0");
      const direction = delta > 0 ? 1 : -1;

      if (productFrame > 0) {
        const canLeaveProduct =
          (productFrame === 4 && direction > 0) ||
          (productFrame === 1 && direction < 0);
        if (!canLeaveProduct) return;
      }

      const y = window.scrollY;
      const withinProduct =
        y >= product.top - 2 && y < purpose.top - window.innerHeight * 0.25;
      const atPurposeTop =
        y >= purpose.top - window.innerHeight * 0.25 &&
        y <= purpose.top + window.innerHeight * 0.25;

      if (withinProduct && direction > 0) {
        event.preventDefault();
        snapTo(purpose.top);
      } else if (atPurposeTop && direction < 0) {
        event.preventDefault();
        snapTo(product.top);
      }
    };

    const handleScroll = () => {
      if (lockedRef.current) return;

      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        const product = getSection("product");
        const purpose = getSection("purpose");
        if (!product || !purpose) return;

        const productFrame = Number(document.documentElement.dataset.productFrame ?? "0");
        if (productFrame > 0) return;

        const productTop = getTop(product);
        const purposeTop = getTop(purpose);
        const y = window.scrollY;
        if (y <= productTop || y >= purposeTop) return;

        const midpoint = productTop + (purposeTop - productTop) / 2;
        snapTo(y < midpoint ? productTop : purposeTop);
      }, 140);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  return null;
}

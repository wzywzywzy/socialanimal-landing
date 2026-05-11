"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Section = "problem" | "product" | "purpose";

const LINKS: { id: Section; label: string; targetId: string; centerX: string }[] = [
  { id: "problem", label: "Problem", targetId: "importance", centerX: "30.6%" },
  { id: "product", label: "Product", targetId: "product", centerX: "48.25%" },
  { id: "purpose", label: "Purpose", targetId: "purpose", centerX: "65.68%" },
];

const NAV_CLEARANCE = 0;

function getTargetTop(target: HTMLElement) {
  return Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE,
  );
}

export function Navbar() {
  const [active, setActive] = useState<Section>("problem");
  const [visible, setVisible] = useState(false);
  const ctaIsDark = active !== "product";

  useEffect(() => {
    const syncActive = () => {
      const hero = document.getElementById("top");
      const product = document.getElementById("product");
      const purpose = document.getElementById("purpose");
      const y = window.scrollY + 180;

      setVisible(window.scrollY > (hero?.offsetHeight ?? window.innerHeight) * 0.65);

      if (purpose && y >= purpose.offsetTop) {
        setActive("purpose");
      } else if (product && y >= product.offsetTop) {
        setActive("product");
      } else {
        setActive("problem");
      }
    };

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, []);

  useEffect(() => {
    const syncHashScroll = () => {
      const targetId = window.location.hash.replace("#", "");
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      window.scrollTo({ top: getTargetTop(target), behavior: "auto" });
    };

    const timeout = window.setTimeout(syncHashScroll, 80);
    window.addEventListener("hashchange", syncHashScroll);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", syncHashScroll);
    };
  }, []);

  const scrollToTarget = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    window.scrollTo({
      top: getTargetTop(target),
      behavior: "smooth",
    });
    window.history.replaceState(null, "", `#${targetId}`);
    window.dispatchEvent(new Event("hashchange"));
  };

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-[158px] transition-opacity duration-300 md:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative mx-auto h-[158px] w-full max-w-[1920px]">
        <Link
          href="/"
          aria-label="Social Animal home"
          className="pointer-events-auto absolute left-[8.65%] top-[71px] block h-[69.529px] w-[73.106px] bg-ink transition-transform hover:scale-[1.04]"
          style={{
            WebkitMaskImage: "url(/assets/logo.svg)",
            maskImage: "url(/assets/logo.svg)",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />

        {/* Single pill containing nav links + Join Waitlist CTA.
            Width 80.33% spans from 14.32% to 94.65% per Figma Frame 55. */}
        <div className="pointer-events-auto absolute left-[14.32%] top-[53px] flex h-[105px] w-[80.33%] items-center rounded-full bg-[#ead8c5]/55 pl-[60px] pr-[12px] shadow-[0_24px_70px_rgba(40,2,13,0.12)] backdrop-blur-[15px]">
          <nav className="flex flex-1 items-center justify-around text-[28px] leading-[43.2px] tracking-[-0.02em]">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToTarget(link.targetId)}
                className={`whitespace-nowrap transition-opacity hover:opacity-100 ${
                  active === link.id
                    ? "font-semibold opacity-100"
                    : "font-light opacity-80"
                }`}
                style={{
                  color:
                    active === "product" && link.id !== "problem"
                      ? "#fae9da"
                      : "#28020d",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <Link
            href="/waitlist"
            className={`ml-6 flex h-[73px] w-[221px] shrink-0 items-center justify-center rounded-full text-center text-[24px] font-semibold leading-[28.8px] tracking-[-0.02em] shadow-[0_10px_30px_rgba(40,2,13,0.18)] transition-transform hover:scale-[1.02] ${
              ctaIsDark ? "bg-ink text-cream" : "bg-cream text-ink"
            }`}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}

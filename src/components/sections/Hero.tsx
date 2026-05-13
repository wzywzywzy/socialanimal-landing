"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

/**
 * Hero is a 2-step scroll-driven cinematic, 1:1 with Figma prototype
 * frames 48 → 50 → 51 (file je3wfSZDd8oZUsH7rsCpOi).
 *
 * The original 4-frame version was wheel-stepped (preventDefault on every
 * wheel event) which made the page feel unscrollable. This version uses
 * ScrollTrigger with `scrub: true` so the timeline plays in lockstep with
 * native window scroll — trackpad/mouse/PgDn/touch all work as expected.
 *
 * Layout:
 *   - <section id="top"> reserves 200vh so ScrollTrigger has a 2-viewport
 *     runway to scrub the 2-segment timeline (48→50, 50→51).
 *   - A sticky inner stage pins the 1920×1080 canvas for the duration.
 */

const CANVAS_W = 1920;
const CANVAS_H = 1080;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("figmaSmart", "M0,0 C0.43,-0.01 0.14,1 1,1");

    const ctx = gsap.context(() => {
      const vh = (figmaPx: number) => `${(figmaPx / CANVAS_H) * 100}vh`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // ── Segment 1: Frame 48 → 50 (timeline 0 → 1) ────────────────────
      // Title 412 → 208 (delta -204 → vh -18.89%)
      // Subtitle 594 → 390 (delta -204). Color stays WHITE throughout.
      // Phone 839 → 605.41 (delta -233.59) + opacity 0→1
      // Soft-light bg 839 → 540 (delta -299) + opacity 0→1
      tl.to(".hero-title", { y: vh(-204), duration: 1, ease: "figmaSmart" }, 0)
        .to(".hero-subtitle", { y: vh(-204), duration: 1, ease: "figmaSmart" }, 0)
        .fromTo(
          ".hero-phone",
          { opacity: 0, y: vh(233.59) },
          { opacity: 1, y: 0, duration: 1, ease: "figmaSmart" },
          0,
        )
        .fromTo(
          ".hero-soft-light-bg",
          { opacity: 0, y: vh(299) },
          { opacity: 1, y: 0, duration: 1, ease: "figmaSmart" },
          0,
        )
        .fromTo(".hero-cta-text", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "figmaSmart" }, 0.4)
        .fromTo(".hero-cta-button", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "figmaSmart" }, 0.5);

      // ── Segment 2: Frame 50 → 51 (timeline 1 → 2) ────────────────────
      // Title pushed off-screen upward (additional delta -459 → vh -42.5%)
      // Subtitle pushed off (additional delta -346 → vh -32%)
      // Phone 605.41 → 127.41 (delta -478 → vh -44.26%)
      // Soft-light bg 540 → 62 (delta -478 → vh -44.26%)
      // "Coming/Soon!" fades in
      tl.to(".hero-title", { opacity: 0, y: vh(-663), duration: 1, ease: "figmaSmart" }, 1)
        .to(".hero-subtitle", { opacity: 0, y: vh(-550), duration: 1, ease: "figmaSmart" }, 1)
        .to(".hero-phone", { y: vh(-478), duration: 1, ease: "figmaSmart" }, 1)
        .to(".hero-soft-light-bg", { y: vh(-478), duration: 1, ease: "figmaSmart" }, 1)
        .fromTo(".hero-coming-soon", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "figmaSmart" }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      {/* Sticky stage pins to the top of the viewport while Hero scrolls.
          z-index normal — navbar (z-50) sits above as designed. */}
      <div
        ref={stageRef}
        className="sticky top-0 left-0 w-screen h-screen overflow-hidden text-cream"
      >
        {/* Base gradient — Figma 557:534 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(217.928deg, #200009 15.351%, #28020d 84.649%)",
          }}
        />

        {/* Texture overlay — Figma 557:535 */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply opacity-25 pointer-events-none"
        >
          <Image
            src="/assets/hero-texture.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <CanvasFrame>
          {/* Decorative dark-wine logo motif behind the phone — Figma 557:589.
              Recolored to dark wine traceries on the ink background. */}
          <FigmaBox
            left={425.41}
            top={540}
            width={1069.837}
            height={1017.469}
            className="hero-soft-light-bg opacity-0 pointer-events-none"
          >
            <img
              src="/assets/hero-soft-light-bg.svg"
              alt=""
              className="absolute inset-0 block w-full h-full"
            />
          </FigmaBox>

          {/* Small logo at navbar position — Frame 48 onward. */}
          <FigmaBox left={923} top={70.59} width={73.106} height={69.529} className="hero-logo-small">
            <SocialAnimalLogo />
          </FigmaBox>

          {/* Title "Give yourself an unfair advantage" — Frame 48 anchor */}
          <FigmaCenteredText left={964} top={412} width={606} className="hero-title">
            <h1
              className="font-display text-cream"
              style={{
                fontSize: "clamp(2.5rem, 3.44vw, 4.125rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Give yourself an{" "}
              <span className="font-sans font-semibold italic">unfair</span>{" "}
              advantage
            </h1>
          </FigmaCenteredText>

          {/* Subtitle — Frame 48 anchor. White all the way through per
              user feedback (was previously plum→cream morph). */}
          <FigmaCenteredText left={964} top={594} width={497} className="hero-subtitle">
            <p
              className="font-sans"
              style={{
                color: "#ffffff",
                fontSize: "clamp(0.95rem, 0.94vw, 1.125rem)",
                lineHeight: 1.111,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Life isn’t fair. It’s much easier for individuals with charisma.
              But the good news is that social skills aren’t fixed - they can
              be learned. And the even better news is that we’re building the
              first great training tool.
            </p>
          </FigmaCenteredText>

          {/* "Coming" / "Soon!" decorative flanking text — Frame 51 only */}
          <div className="hero-coming-soon opacity-0">
            <FigmaCenteredText left={964 - 694.76} top={624} width={159.657}>
              <p
                className="font-sans"
                style={{
                  color: "#6a122a",
                  fontSize: "clamp(1rem, 1.31vw, 1.575rem)",
                  lineHeight: "28.8px",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Coming
              </p>
            </FigmaCenteredText>
            <FigmaCenteredText left={964 + 694.76} top={624} width={159.657}>
              <p
                className="font-sans"
                style={{
                  color: "#6a122a",
                  fontSize: "clamp(1rem, 1.31vw, 1.575rem)",
                  lineHeight: "28.8px",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Soon!
              </p>
            </FigmaCenteredText>
          </div>

          {/* Phone mockup — anchored at Frame 50 position, hidden initially */}
          <FigmaBox left={484.12} top={605.41} width={952.275} height={952.275} className="hero-phone opacity-0 pointer-events-none">
            <Image
              src="/assets/hero-phone-mock.png"
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 952px"
              priority
            />
          </FigmaBox>

          {/* Bottom ink fade — Figma 557:546 */}
          <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${(624 / CANVAS_H) * 100}%`,
              height: `${(456.309 / CANVAS_H) * 100}%`,
              background:
                "linear-gradient(to bottom, rgba(40,2,13,0), #28020d)",
            }}
          />

          {/* CTA copy + button — Frame 50 anchor */}
          <FigmaCenteredText left={957.12} top={834.56} width={459.811} className="hero-cta-text opacity-0">
            <p
              className="font-sans text-cream"
              style={{
                fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Want to be among the first to try it?
              <br />
              Sign up for the waitlist here
            </p>
          </FigmaCenteredText>

          <div
            className="hero-cta-button absolute opacity-0"
            style={{
              top: `${(930 / CANVAS_H) * 100}%`,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${(190 / CANVAS_W) * 100}%`,
              height: `${(66 / CANVAS_H) * 100}%`,
            }}
          >
            <Link
              href="/waitlist"
              className="flex h-full w-full items-center justify-center rounded-full bg-cream text-ink font-sans font-semibold transition-transform hover:scale-[1.03]"
              style={{
                fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Join Waitlist
            </Link>
          </div>
        </CanvasFrame>
      </div>
    </section>
  );
}

/* ───────── primitives ───────── */

function CanvasFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 mx-auto"
      style={{
        maxWidth: `${CANVAS_W}px`,
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
      }}
    >
      {children}
    </div>
  );
}

function FigmaBox({
  left,
  top,
  width,
  height,
  className = "",
  children,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${(left / CANVAS_W) * 100}%`,
        top: `${(top / CANVAS_H) * 100}%`,
        width: `${(width / CANVAS_W) * 100}%`,
        height: `${(height / CANVAS_H) * 100}%`,
      }}
    >
      {children}
    </div>
  );
}

function FigmaCenteredText({
  left,
  top,
  width,
  className = "",
  children,
}: {
  left: number;
  top: number;
  width: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute text-center ${className}`}
      style={{
        left: `${(left / CANVAS_W) * 100}%`,
        top: `${(top / CANVAS_H) * 100}%`,
        width: `${(width / CANVAS_W) * 100}%`,
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </div>
  );
}

function SocialAnimalLogo() {
  return (
    <span
      aria-hidden
      className="block w-full h-full bg-cream"
      style={{
        WebkitMaskImage: "url(/assets/logo.svg)",
        maskImage: "url(/assets/logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

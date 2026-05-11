"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * Hero is a 4-frame scroll-driven cinematic, 1:1 with Figma prototype
 * frames 52 → 48 → 50 → 51 (file je3wfSZDd8oZUsH7rsCpOi).
 *
 * Layout strategy:
 *   - Outer <section> is 4× viewport tall — gives ScrollTrigger a 4 vh runway
 *     to play the timeline through three transitions (52→48, 48→50, 50→51).
 *   - Inner pinned stage is 100vh and contains a 1920×1292 absolute canvas
 *     scaled to fit the viewport (responsive without breaking Figma's
 *     pixel-perfect layout).
 *   - Every element is positioned by its Figma global pixel coordinates so
 *     the timeline can morph between exact frame states.
 *
 * Per-element keyframes are derived from the Figma data (opacity / x / y /
 * width). Properties that don't change between frames are baseline styles;
 * properties that do change live in the timeline.
 */

// Figma canvas — every <Frame N> in Figma is 1920×1080, but the gradient/
// texture extends to 1292 to cover the bottom CTA fade.
const CANVAS_W = 1920;
const CANVAS_H = 1080;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    gsap.registerPlugin(CustomEase);

    // Cubic bezier copied from the Figma prototype interaction panel
    // (every CUSTOM_BEZIER transition uses the same one):
    // cubic-bezier(0.43, -0.01, 0.14, 1). The negative -0.01 is the
    // "anticipation" — elements settle back briefly before sweeping
    // forward, the keynote feel the user asked for.
    CustomEase.create("figmaSmart", "M0,0 C0.43,-0.01 0.14,1 1,1");

    // Per-segment durations from Figma prototype (in seconds):
    //   Frame 52 → 48 = 1.0s
    //   Frame 48 → 50 = 2.0s
    //   Frame 50 → 51 = 2.0s
    // Total content time = 5s; timeline is built at this scale and
    // tweened segment-by-segment to honor each Figma duration exactly.
    const SEGMENT_DURATIONS = [1.0, 2.0, 2.0];
    const FRAME_PROGRESS = [0, 0.2, 0.6, 1.0]; // proportional to durations

    let cleanupObserver: (() => void) | undefined;
    let cleanupKey: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Helper: turn a Figma-pixel delta into a vh string (canvas is 1080px).
      const vh = (figmaPx: number) => `${(figmaPx / CANVAS_H) * 100}vh`;

      // Build the master timeline. Total duration = sum of segment durations,
      // sub-tweens are placed in their own segment so each plays at exactly
      // the Figma-spec speed. The timeline is paused; we tween its progress
      // segment-by-segment via Observer.
      const tl = gsap.timeline({ paused: true });

      // Will be filled in below — used by goToFrame to know how long each
      // tween between frames should take.
      // (We mutate tl directly via tweenTo — no need for a separate getter.)

      // ── Frame 52 → 48 (0 → 1/3) ────────────────────────────────────
      // Splash logo morphs straight UP into navbar position (no x offset:
      // big logo is centered at x=960, small logo at x=959.5 — same axis).
      // Big logo center: (960, 540). Small logo center: (959.5, 105.35).
      // Y delta = 105.35 - 540 = -434.65 → as %: -40.25%.
      // Scale: small w 73.106 / big w 250 = 0.2924.
      tl.to(
        ".hero-logo-big",
        { opacity: 0, scale: 0.2924, y: vh(-434.65), x: 0, duration: 1, ease: "figmaSmart", transformOrigin: "center center" },
        0,
      )
        .fromTo(".hero-logo-small", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "figmaSmart" }, 0.5)
        // Title enters from BELOW its final pos. Start y = +200px in canvas
        // (just below the future title slot, not deep at the bottom — that
        // was causing it to sweep past the navbar logo on the way up).
        .fromTo(".hero-title", { opacity: 0, y: vh(200) }, { opacity: 1, y: 0, duration: 1, ease: "figmaSmart" }, 0.1)
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: vh(200), color: "#6a122a" },
          { opacity: 1, y: 0, color: "#6a122a", duration: 1, ease: "figmaSmart" },
          0.1,
        )
        // Soft-light decorative vector behind the phone — fades from 0 to 1
        // across this transition (Figma frame 48 → 50 reveals it).
        .set(".hero-soft-light-bg", { opacity: 0 }, 0)
        .set(".hero-phone", { opacity: 0 }, 0)
        .set(".hero-cta-text", { opacity: 0 }, 0)
        .set(".hero-cta-button", { opacity: 0 }, 0)
        .set(".hero-coming-soon", { opacity: 0 }, 0);

      // ── Frame 48 → 50 (1/3 → 2/3) ──────────────────────────────────
      // Title 412 → 208 (delta -204 → vh -18.89%).
      // Subtitle 594 → 390 (delta -204) AND color shifts to cream.
      // Phone 839 → 605.41 (delta -233.59 → vh -21.63%) AND opacity 0→1.
      // Soft-light bg 839 → 540 (delta -299 → vh -27.69%) AND opacity 0→1.
      tl.to(".hero-title", { y: vh(-204), duration: 1, ease: "figmaSmart" }, 1)
        .to(".hero-subtitle", { y: vh(-204), color: "#f5ebe2", duration: 1, ease: "figmaSmart" }, 1)
        .fromTo(
          ".hero-phone",
          { opacity: 0, y: vh(233.59) },
          { opacity: 1, y: 0, duration: 1, ease: "figmaSmart" },
          1,
        )
        .fromTo(
          ".hero-soft-light-bg",
          { opacity: 0, y: vh(299) },
          { opacity: 1, y: 0, duration: 1, ease: "figmaSmart" },
          1,
        )
        .fromTo(".hero-cta-text", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "figmaSmart" }, 1.4)
        .fromTo(".hero-cta-button", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "figmaSmart" }, 1.5);

      // ── Frame 50 → 51 (2/3 → 1) ────────────────────────────────────
      // Title pushed off-screen upward (delta to top -251: -663 from 412 = vh -61.4%).
      // Subtitle pushed off (delta -550 → vh -50.93%).
      // Phone 605.41 → 127.41 (delta -478 → vh -44.26%).
      // Soft-light bg 540 → 62 (delta -478 → vh -44.26%) — moves with phone.
      // "Coming / Soon!" decorative text fades in.
      tl.to(".hero-title", { opacity: 0, y: vh(-663), duration: 1, ease: "figmaSmart" }, 2)
        .to(".hero-subtitle", { opacity: 0, y: vh(-550), duration: 1, ease: "figmaSmart" }, 2)
        .to(".hero-phone", { y: vh(-478), duration: 1, ease: "figmaSmart" }, 2)
        .to(".hero-soft-light-bg", { y: vh(-478), duration: 1, ease: "figmaSmart" }, 2)
        .fromTo(".hero-coming-soon", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "figmaSmart" }, 2.3);

      // Timeline labels at the end of each segment (in timeline-time, sec).
      // Each segment is 1s of authored content; we'll stretch playback per
      // segment via tweenFromTo's duration override so each section plays
      // at the exact Figma-spec wall-clock time.
      // segment 0: frame 52→48 plays 0→1 in 1.0s (1x)
      // segment 1: frame 48→50 plays 1→2 in 2.0s (0.5x)
      // segment 2: frame 50→51 plays 2→3 in 2.0s (0.5x)
      const FRAME_TIMES = [0, 1, 2, 3];

      let currentFrame = 0;
      let isAnimating = false;

      const goToFrame = (target: number) => {
        if (isAnimating) return;
        if (target < 0 || target > 3 || target === currentFrame) return;
        const segIdx = Math.min(currentFrame, target);
        const dur = SEGMENT_DURATIONS[segIdx];
        const fromTime = FRAME_TIMES[currentFrame];
        const toTime = FRAME_TIMES[target];
        isAnimating = true;
        gsap.to(tl, {
          time: toTime,
          duration: dur,
          ease: "figmaSmart",
          overwrite: true,
          onStart: () => {
            // Ensure the playhead is exactly at the from-position before
            // tweening (in case a partial scroll left it mid-segment).
            if (Math.abs(tl.time() - fromTime) > 0.01) tl.time(fromTime);
          },
          onComplete: () => {
            currentFrame = target;
            isAnimating = false;
          },
        });
      };

      // Native wheel handler: intercept only while transitioning between
      // hero frames. At frame 3 + scroll-down (or frame 0 + scroll-up) we
      // release the wheel so the page scrolls naturally into the next
      // section (Problem). The sticky stage scrolls out with the page.
      let lastWheelTs = 0;
      const handleWheel = (e: WheelEvent) => {
        const goingDown = e.deltaY > 0;
        const goingUp = e.deltaY < 0;
        // At boundaries, release wheel to native scroll.
        if (currentFrame >= 3 && goingDown) return;
        if (currentFrame <= 0 && goingUp) return;
        e.preventDefault();
        if (isAnimating) return;
        // Debounce successive wheel events from a single gesture (most
        // trackpads send a burst of 10+ events; we want one frame step
        // per gesture, not ten).
        const now = Date.now();
        if (now - lastWheelTs < 200) return;
        lastWheelTs = now;
        if (goingDown) goToFrame(currentFrame + 1);
        else if (goingUp) goToFrame(currentFrame - 1);
      };
      window.addEventListener("wheel", handleWheel, { passive: false });

      cleanupObserver = () =>
        window.removeEventListener("wheel", handleWheel);

      // Click anywhere on the stage to advance one frame; cycles back to 0.
      const handleStageClick = () => {
        if (currentFrame >= 3) goToFrame(0);
        else goToFrame(currentFrame + 1);
      };
      const stage = stageRef.current;
      stage?.addEventListener("click", handleStageClick);

      // Keyboard nav: ArrowDown / Space → next, ArrowUp → prev.
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          goToFrame(currentFrame + 1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          goToFrame(currentFrame - 1);
        }
      };
      window.addEventListener("keydown", handleKey);

      cleanupKey = () => {
        stage?.removeEventListener("click", handleStageClick);
        window.removeEventListener("keydown", handleKey);
      };
    }, sectionRef);

    return () => {
      cleanupObserver?.();
      cleanupKey?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative w-full h-screen"
    >
      {/* Stage uses position:sticky — it sticks to the top of the viewport
          while the user is inside the Hero <section>, then scrolls out with
          the section once they pass it (so Problem isn't covered).
          z-[60] keeps it ABOVE the page-level Navbar (z-50) so the navbar
          is hidden while Hero is on screen (Figma frame 52 has no navbar);
          the navbar reappears naturally once Hero scrolls past. The parent
          <section> is h-screen, reserving exactly one viewport of layout
          space; the wheel-handler intercepts wheel events to advance frames
          until frame 3, then releases the wheel for native scroll. */}
      <div
        ref={stageRef}
        className="sticky top-0 left-0 w-screen h-screen overflow-hidden text-cream z-[60]"
      >
        {/* Base gradient — Figma 557:534: linear-gradient(217.928°, #200009 15.35%, #28020d 84.65%) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(217.928deg, #200009 15.351%, #28020d 84.649%)",
          }}
        />

        {/* Texture overlay — Figma 557:535: mix-blend-multiply, opacity 25% */}
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

        {/* Fixed-aspect Figma canvas (1920×1080), centered + scaled.
            NOTE: the bottom ink fade used to live here (between texture and
            canvas), which put it BELOW the phone in z-order — wrong. Per
            Figma frame 50, the ink fade rectangle (group 162) sits ABOVE
            the phone but BELOW the CTA, darkening any element that crosses
            it. We've moved it inside CanvasFrame, after the phone and
            before the CTA, to recreate that exact stacking. */}
        <CanvasFrame>
          {/* Decorative dark-wine logo motif behind the phone — Figma 557:589.
              The exported SVG uses gradient strokes; we recolored them to a
              dark wine palette (#3a0a16 → #5a1428) so on the ink/maroon
              background the lines read as subtle, slightly darker traceries
              instead of bright cream highlights. No blend-mode needed. */}
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

          {/* Big splash logo — Frame 52: 250×237.767 centered at canvas x=960
              (left=835, w=250 → center 960). Morph target = navbar-sized
              73.106×69.529 also centered at x=959.5 (left=923, w=73.1 →
              center 959.55). Same X axis, so the morph is a pure vertical
              scale-down from y=540 (big center) to y=105.35 (small center). */}
          <FigmaBox left={835} top={421} width={250} height={237.767} className="hero-logo-big">
            <SocialAnimalLogo />
          </FigmaBox>

          {/* Small logo (navbar position) — appears as splash logo finishes morph.
              Same SVG, different size. Frame 48–51 position: (923, 70.59), 73×69.5. */}
          <FigmaBox left={923} top={70.59} width={73.106} height={69.529} className="hero-logo-small opacity-0">
            <SocialAnimalLogo />
          </FigmaBox>

          {/* Title "Give yourself an unfair advantage" — Frame 48 position
              (translateX -1/2 from left=964, top=412), Fedro 66/66.
              opacity-0 prevents an SSR flash before GSAP sets the frame-52
              starting state on hydration. Animates upward through 48→50→51. */}
          <FigmaCenteredText left={964} top={412} width={606} className="hero-title opacity-0">
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

          {/* Subtitle — Frame 48 starts at y=594 (color plum), morphs to y=390
              + color cream by Frame 50. Width 497, Figtree 18/20.
              opacity-0 prevents the SSR flash before hydration. */}
          <FigmaCenteredText left={964} top={594} width={497} className="hero-subtitle opacity-0">
            <p
              className="font-sans"
              style={{
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

          {/* "Coming" / "Soon!" decorative flanking text — Frame 51 position
              y=624, plum color. Hidden until Frame 50→51 transition. */}
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

          {/* Phone mockup — Frame 50 position (484.12, 605.41), 952×952.
              Starts hidden (Frame 52/48), rises to mid in Frame 50, rises
              further to (484, 127) by Frame 51. */}
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

          {/* Bottom ink fade — Figma 557:546: at y=624 in canvas, height
              456.309, gradient transparent ink → solid ink. Stacked ABOVE
              the phone (and soft-light bg) so when those elements are at
              their frame-50 lower position they're visibly darkened by the
              fade; in frame 51 they rise above the fade and become full
              brightness. The exact effect the user noticed was missing. */}
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

          {/* CTA copy — Frame 50: y=834.56, cream, 24/24, width 459.811. */}
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

          {/* CTA button — Frame 50: 190×66 cream pill, ink text "Join Waitlist",
              centered horizontally, top=930. */}
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

/** Wraps children in the 1920×1080 Figma canvas, centered + responsively scaled. */
function CanvasFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 mx-auto"
      style={{
        maxWidth: `${CANVAS_W}px`,
        // The canvas is 1920×1080. We let CSS fit it into the viewport
        // by anchoring width to the section and computing height from
        // aspect ratio — but since the stage is h-screen, the canvas
        // will letterbox if viewport aspect != 16:9.
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
      }}
    >
      {children}
    </div>
  );
}

/** Absolutely positions a box using Figma global pixel coords as % of canvas. */
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

/** Figma "translate-x-(-1/2)" pattern — left is the centerpoint. */
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

/** The Social Animal hexagram logo as cream-tinted CSS mask of /assets/logo.svg.
 *  Same SVG used at splash size (250×238) and navbar size (73×69.5). */
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

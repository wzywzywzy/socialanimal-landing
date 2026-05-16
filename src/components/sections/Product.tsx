"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * Product cinematic — Figma frames 71 (intro) → 66 → 67 → 68 → 69 (steps 01–04).
 *
 * Layout (shared across all 5 frames, 1920×1080 canvas):
 *   - Left half (0–845): cream background. Hosts the active step content
 *     (number, body, progress indicator). Frame 71 has its own intro content
 *     (heading + body).
 *   - Right half (845–1920): dark wine panel + texture + scene screenshot
 *     that swaps between steps. Step 04 is the green-finale variant.
 *
 * This version is scroll-driven (sticky + ScrollTrigger) — previously it
 * intercepted wheel events which made the page feel unscrollable. Now the
 * 5 frames advance with native scroll; user just scrolls past the section.
 */

const CANVAS_W = 1920;
const CANVAS_H = 1080;
// Total frames: intro (0) + 4 steps (1..4). Each frame gets one viewport of
// scroll runway, so the section reserves 5vh of layout.
const TOTAL_FRAMES = 5; // 0..4

// Mobile portrait canvas (Figma mobile frames 244→247, 1080×1920).
// Measured from the design:
//  • dark laptop panel flat top  ≈ y 1072/1920 (55.8%) — bottom ~44%
//  • green finale panel top      ≈ y  968/1920 (50.4%) — bottom ~50%
//  • panel rounded top radius    ≈ 60/1080 of the canvas width
const M_W = 1080;
const M_H = 1920;
const DARK_PANEL_TOP = `${(1072 / M_H) * 100}%`; // ≈ 55.8%
const GREEN_PANEL_TOP = `${(968 / M_H) * 100}%`; // ≈ 50.4%
const PANEL_RADIUS = `${(60 / M_W) * 100}vw`; // ≈ 5.5vw, matches Figma 60px
// Cream text area ends where the higher of the two panels begins, so text
// never collides with either scene.
const TEXT_BOTTOM = GREEN_PANEL_TOP;

interface Step {
  number: string;
  description: React.ReactNode;
  sceneSrc?: string;
  overlaySrc?: string;
  variant?: "dark-scene" | "green-finale";
}

const STEPS: Step[] = [
  {
    number: "01",
    description:
      "Describe the situation you want to prepare for — a job interview, a first date or something else.",
    sceneSrc: "/assets/product-step-01.png",
    variant: "dark-scene",
  },
  {
    number: "02",
    description:
      "Practice with a lifelike avatar, tailored to the situation you’ve described.",
    sceneSrc: "/assets/product-step-02-base.png",
    overlaySrc: "/assets/product-step-02-overlay.png",
    variant: "dark-scene",
  },
  {
    number: "03",
    description: (
      <>
        Get actionable, science-based feedback based on the cues you’re
        sending.{" "}
        <span className="opacity-80">
          (The visual, verbal and vocal cues that determine how other people
          see you.)
        </span>
      </>
    ),
    sceneSrc: "/assets/product-step-03-base.png",
    overlaySrc: "/assets/product-step-03-overlay.png",
    variant: "dark-scene",
  },
  {
    number: "04",
    description: (
      <>
        Track your progress and keep practicing until you become a true{" "}
        <span className="font-semibold italic">social animal.</span>
      </>
    ),
    variant: "green-finale",
  },
];

export function Product() {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return (
      <section
        id="product"
        className="relative w-full"
        style={{ height: `${TOTAL_FRAMES * 100}vh` }}
      />
    );
  }
  return isMobile ? <ProductMobile /> : <ProductDesktop />;
}

function ProductDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Map progress 0..1 → frame 0..(TOTAL_FRAMES-1).
        // floor() with a small head-start so each frame "lands" when its
        // runway starts. progress=0 → frame 0, progress=0.99 → frame 4.
        const frame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * TOTAL_FRAMES),
        );
        setActiveFrame(frame);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative w-full"
      // 5 frames × 100vh of scroll runway. Sticky inner stage stays pinned
      // for the entire section's height, while activeFrame swaps via state.
      style={{ height: `${TOTAL_FRAMES * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-screen overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(240.66deg, #f5ebe2 0%, #ffe8d3 99.99%)",
        }}
      >
        {/* Figma 1920×1080 canvas, responsive scale to viewport */}
        <div
          className="absolute inset-0 mx-auto"
          style={{
            maxWidth: `${CANVAS_W}px`,
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
          }}
        >
          {/* Intro pane — Frame 71. Visible when activeFrame === 0. */}
          <div
            className={`product-intro absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
              activeFrame === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateZ(0)", willChange: "opacity" }}
          >
            <RightDarkPanel />
            <IntroScene />
            <IntroPane />
          </div>

          {/* Step panes — one visible at a time via opacity. */}
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`product-step-${i} absolute inset-0 pointer-events-none transition-opacity ease-out ${
                activeFrame === i + 1
                  ? "opacity-100 duration-200"
                  : "opacity-0 duration-150"
              }`}
              style={{ transform: "translateZ(0)", willChange: "opacity" }}
            >
              <StepPane step={step} stepIndex={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Mobile Product (Figma mobile frames 244→247) ─────────
   Same 5-frame scroll-driven sequence as desktop, reflowed vertically:
   text/number/progress in the cream area on top, the scene image in a
   full-width panel below. ← → arrows + progress dots mirror the design;
   they also let users step frames without scrolling. */
function ProductMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const frame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * TOTAL_FRAMES),
        );
        setActiveFrame(frame);
      },
    });
    return () => trigger.kill();
  }, []);

  // Tapping an arrow scrolls to the middle of that frame's runway so the
  // ScrollTrigger lands cleanly on it.
  const goToFrame = (frame: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));
    const top = el.offsetTop;
    const runway = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (runway * (clamped + 0.5)) / TOTAL_FRAMES,
      behavior: "smooth",
    });
  };

  const isIntro = activeFrame === 0;
  const step = isIntro ? null : STEPS[activeFrame - 1];

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative w-full"
      style={{ height: `${TOTAL_FRAMES * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-screen overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(240.66deg, #f5ebe2 0%, #ffe8d3 99.99%)",
        }}
      >
        {/* Fixed 1080×1920 portrait canvas so every element keeps its exact
            Figma ratio at any viewport (Frame 246). The cream text area is
            the top ~51%; the scene panel is the bottom ~49% with a 60px
            rounded top, exactly per the design. */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            height: "100vh",
            aspectRatio: `${M_W} / ${M_H}`,
            maxWidth: "100vw",
          }}
        >
          {/* ── Scene panel ──
              Geometry measured from Figma Frames 244–247 (1080×1920):
              • Dark laptop panel: flat top at y≈1072/1920 (55.8%), bottom
                44%, rounded top ≈60/1080 of width. The 3840×2160 source PNG
                has ~26% empty transparent top, so object-cover object-bottom
                fills the panel width with the laptop large and bottom-bled,
                cropping only the empty top — no vertical over-stretch (which
                was the blur source).
              • Green finale: separate, shallower panel — top at y≈968 (50.4%),
                small 20px radius, nearly square; the person stays INSIDE the
                panel (does not bleed into the cream), large and centred on
                the star, bottom-cropped. */}
          <div className="absolute inset-0">
            {/* Intro + dark steps */}
            <div
              className={`absolute inset-x-0 bottom-0 overflow-hidden transition-opacity duration-300 ${
                isIntro || step?.variant === "dark-scene"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{
                top: DARK_PANEL_TOP,
                borderTopLeftRadius: PANEL_RADIUS,
                borderTopRightRadius: PANEL_RADIUS,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(222.25deg, #200009 15.351%, #28020d 84.649%)",
                }}
              />
              <div className="absolute inset-0 mix-blend-multiply opacity-25">
                <Image
                  src="/assets/hero-texture.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <Image
                key={isIntro ? "intro" : step?.sceneSrc}
                src={
                  isIntro
                    ? "/assets/product-scene-intro.png"
                    : (step?.sceneSrc ?? "/assets/product-scene-intro.png")
                }
                alt=""
                fill
                className="object-cover object-bottom"
                sizes="100vw"
                quality={95}
              />
              {!isIntro && step?.overlaySrc && (
                <Image
                  src={step.overlaySrc}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  sizes="100vw"
                  quality={95}
                />
              )}
            </div>

            {/* Green finale (step 04) */}
            <div
              className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-[20px] bg-quote-green transition-opacity duration-300 ${
                step?.variant === "green-finale" ? "opacity-100" : "opacity-0"
              }`}
              style={{ top: GREEN_PANEL_TOP }}
            >
              <img
                src="/assets/product-step-04-star.svg"
                alt=""
                aria-hidden
                className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-x-0 bottom-0 top-[10%] flex items-end justify-center">
                <Image
                  src="/assets/product-step-04-person.png"
                  alt=""
                  width={1251}
                  height={1251}
                  className="h-full w-auto max-w-none object-contain object-bottom"
                  sizes="100vw"
                  quality={95}
                />
              </div>
            </div>
          </div>

          {/* ── Cream text area (top ~51%) ──
              Content is vertically centred between the fixed navbar and the
              divider so it never gets pushed off the top, regardless of how
              long the step copy is (step 3 is the longest). */}
          <div
            className="absolute inset-x-0 top-0 flex flex-col items-center justify-center px-6 text-center"
            style={{
              bottom: `calc(100% - ${TEXT_BOTTOM})`,
              paddingTop: "104px", // clear the fixed 88px mobile navbar
              paddingBottom: "84px", // leave room for the pinned arrows row
            }}
          >
            {isIntro ? (
              <>
                <h2
                  className="font-display"
                  style={{
                    color: "#50091e",
                    fontSize: "clamp(2.25rem, 9vw, 3rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    fontWeight: 500,
                  }}
                >
                  Introducing
                  <br />
                  <span className="font-sans font-semibold italic">
                    Social Animal
                  </span>
                </h2>
                <p
                  className="mt-5 max-w-[460px] font-sans"
                  style={{
                    color: "#50091e",
                    fontSize: "clamp(0.95rem, 4vw, 1.2rem)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Social Animal is an AI-powered tool that lets you practice,
                  improve and gain confidence on your own.
                </p>
                <div
                  className="mt-7 flex items-center gap-2 rounded-full border border-plum/40 px-6 py-3 font-sans"
                  style={{
                    color: "#50091e",
                    fontSize: "clamp(0.9rem, 3.6vw, 1.05rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  See how it works <span aria-hidden>→</span>
                </div>
              </>
            ) : (
              <>
                <p
                  className="font-sans font-semibold"
                  style={{
                    color: "#50091e",
                    fontSize: "clamp(1.75rem, 7.5vw, 2.375rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step?.number === "01"
                    ? "Describe"
                    : step?.number === "02"
                      ? "Practice"
                      : step?.number === "03"
                        ? "Get feedback"
                        : "Track progress"}
                </p>
                <p
                  className="mt-4 max-w-[480px] font-sans"
                  style={{
                    color: "#50091e",
                    fontSize: "clamp(1.05rem, 4.8vw, 1.4rem)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step?.description}
                </p>
              </>
            )}

            {/* arrows + progress dots — pinned just above the divider */}
            {!isIntro && (
              <div className="absolute inset-x-6 bottom-[6%] flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous step"
                  onClick={() => goToFrame(activeFrame - 1)}
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-95"
                >
                  ←
                </button>
                <div className="flex items-center gap-2">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: i === activeFrame - 1 ? 24 : 8,
                        height: 8,
                        background:
                          i === activeFrame - 1
                            ? "#50091e"
                            : "rgba(80,9,30,0.3)",
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next step"
                  onClick={() => goToFrame(activeFrame + 1)}
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-95"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── sub-components ───────── */

function pct(value: number, base: number) {
  return `${(value / base) * 100}%`;
}

function RightDarkPanel() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        left: pct(845, CANVAS_W),
        top: 0,
        width: pct(1075, CANVAS_W),
        height: "100%",
        backgroundImage:
          "linear-gradient(229.32deg, #200009 15%, #28020d 85%)",
      }}
    >
      <div className="absolute inset-0 mix-blend-multiply opacity-25 pointer-events-none">
        <Image
          src="/assets/hero-texture.png"
          alt=""
          fill
          className="object-cover"
          sizes="60vw"
        />
      </div>
      <div
        aria-hidden
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: pct(467, CANVAS_H),
          background: "linear-gradient(to bottom, rgba(40,2,13,0), #28020d)",
          opacity: 0.25,
        }}
      />
    </div>
  );
}

function IntroPane() {
  // Figma 557:811: "Introducing / Social Animal" big serif headline at
  // (166, 392), then highlight pill behind "Social Animal" only, body at
  // y=586. Per user feedback the floating pills (Anxious/Awkward/...) and
  // the "See how it works" CTA are removed — scroll advances frames now.
  return (
    <>
      {/* Highlight pill behind "Social Animal" (the second line only).
          Headline starts at y=392 with line-height 66px, so the second
          line baseline is around y=458. The rect sits behind the second
          line: top=476 (a touch below the cap-height) so it tints just
          "Social Animal", not "Introducing". */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: pct(151, CANVAS_W),
          top: pct(476, CANVAS_H),
          width: pct(428, CANVAS_W),
          height: pct(60, CANVAS_H),
          background: "#fff8f3",
          transform: "rotate(-2.65deg)",
          transformOrigin: "center",
        }}
      />

      <h2
        className="absolute font-display"
        style={{
          left: pct(166, CANVAS_W),
          top: pct(392, CANVAS_H),
          width: pct(595, CANVAS_W),
          color: "#50091e",
          fontSize: "clamp(2.25rem, 3.44vw, 4.125rem)",
          lineHeight: "66px",
          letterSpacing: "-0.02em",
          fontWeight: 500,
          margin: 0,
        }}
      >
        Introducing
        <br />
        <span className="font-sans font-semibold italic">Social Animal</span>
      </h2>

      <p
        className="absolute font-sans"
        style={{
          left: pct(151, CANVAS_W),
          top: pct(586, CANVAS_H),
          width: pct(457, CANVAS_W),
          color: "#50091e",
          fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
          lineHeight: "30px",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Social Animal is an AI-powered tool that lets you practice, improve and
        gain confidence on your own.
      </p>
    </>
  );
}

function IntroScene() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        left: pct(460, CANVAS_W),
        top: pct(57, CANVAS_H),
        width: pct(1874, CANVAS_W),
        height: pct(1054, CANVAS_H),
      }}
    >
      <Image
        src="/assets/product-scene-intro.png"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}

interface StepPaneProps {
  step: Step;
  stepIndex: number;
}

function StepPane({ step, stepIndex }: StepPaneProps) {
  const isFinale = step.variant === "green-finale";

  return (
    <>
      {isFinale ? <FinaleScene /> : <DarkProductScene step={step} />}

      <p
        className="absolute font-sans font-semibold"
        style={{
          left: pct(166, CANVAS_W),
          top: pct(392, CANVAS_H),
          width: pct(56, CANVAS_W),
          color: "#50091e",
          fontSize: "clamp(1.25rem, 1.875vw, 2.25rem)",
          lineHeight: "36px",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {step.number}
      </p>

      <p
        className="absolute font-sans"
        style={{
          left: pct(166, CANVAS_W),
          top: pct(486, CANVAS_H),
          width: pct(474, CANVAS_W),
          color: "#50091e",
          fontSize: "clamp(1.125rem, 1.56vw, 1.875rem)",
          lineHeight: "36px",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {step.description}
      </p>

      <ProgressIndicator activeIndex={stepIndex} />
    </>
  );
}

function ProgressIndicator({ activeIndex }: { activeIndex: number }) {
  const dotSize = 12;
  const pillHeight = 45;
  const itemGap = 8;
  const trackHeight = pillHeight + dotSize * 3 + itemGap * 3;
  const itemTops = STEPS.reduce<number[]>((tops, _, index) => {
    const previousTop = tops[index - 1] ?? 0;
    const previousHeight =
      index === 0 ? 0 : index - 1 === activeIndex ? pillHeight : dotSize;
    tops.push(index === 0 ? 0 : previousTop + previousHeight + itemGap);
    return tops;
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: pct(50, CANVAS_W),
        top: pct(485, CANVAS_H),
        width: pct(12, CANVAS_W),
        height: pct(trackHeight, CANVAS_H),
      }}
    >
      {itemTops.map((top, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className="absolute rounded-full transition-[top,height] duration-200 ease-out"
            style={{
              left: "50%",
              top: pct(top, trackHeight),
              width: pct(isActive ? 10 : dotSize, 12),
              height: pct(isActive ? pillHeight : dotSize, trackHeight),
              background: isActive ? "#c8ad93" : "rgba(40, 2, 13, 0.4)",
              transform: "translateX(-50%)",
            }}
          />
        );
      })}
    </div>
  );
}

function DarkProductScene({ step }: { step: Step }) {
  if (!step.sceneSrc) return null;

  return (
    <>
      <RightDarkPanel />
      <div
        className="absolute"
        style={{
          left: pct(460, CANVAS_W),
          top: pct(57, CANVAS_H),
          width: pct(1874, CANVAS_W),
          height: pct(1054, CANVAS_H),
        }}
      >
        <Image
          src={step.sceneSrc}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {step.overlaySrc && (
        <div
          className="absolute"
          style={{
            left: pct(460, CANVAS_W),
            top: pct(57, CANVAS_H),
            width: pct(1874, CANVAS_W),
            height: pct(1054, CANVAS_H),
          }}
        >
          <Image
            src={step.overlaySrc}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
    </>
  );
}

function FinaleScene() {
  // Step 04 — green panel with a portrait of a smiling person + star outline.
  // Per user feedback the "Together, we can!" overlay text has been removed
  // and the portrait is cropped to shoulders-up via objectPosition.
  return (
    <div
      aria-hidden
      className="absolute overflow-hidden bg-quote-green"
      style={{
        left: pct(845, CANVAS_W),
        top: 0,
        width: pct(1075, CANVAS_W),
        height: "100%",
        borderRadius: "20px",
      }}
    >
      <img
        src="/assets/product-step-04-star.svg"
        alt=""
        className="absolute"
        style={{
          left: pct(78, 1075),
          top: pct(100, CANVAS_H),
          width: pct(948, 1075),
          height: pct(856.212, CANVAS_H),
        }}
      />
      <div
        className="absolute overflow-hidden"
        style={{
          left: pct(218, 1075),
          top: pct(247, CANVAS_H),
          width: pct(667, 1075),
          height: pct(833, CANVAS_H),
        }}
      >
        <Image
          src="/assets/product-step-04-person.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "50% 10%" }}
          sizes="45vw"
        />
      </div>
      <img
        src="/assets/product-step-04-fade.svg"
        alt=""
        className="absolute bottom-0 left-0 w-full"
      />
    </div>
  );
}

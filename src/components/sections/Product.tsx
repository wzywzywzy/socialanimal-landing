"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Product cinematic — Figma frames 71 (intro) → 66 → 67 → 68 → 69 (steps 01–04).
 *
 * Layout (shared across all 5 frames, 1920×1080 canvas):
 *   - Left half (0–845): cream background. Hosts the navbar, the active
 *     step content (number, body, pill+dot indicator), and a bottom logo.
 *     Frame 71 has its own intro content (heading + CTA + floating pills).
 *   - Right half (845–1920): dark wine panel + texture + scene screenshot
 *     that swaps between steps.
 *
 * Per-segment Figma transition durations (from prototype):
 *   intro → 01 = 500ms (CUSTOM_BEZIER)
 *   01    → 02 = 100ms (DISSOLVE)
 *   02    → 03 = 100ms (DISSOLVE)
 *   03    → 04 = 100ms (DISSOLVE)
 *
 * Same wheel/click/keyboard interaction model as Hero: sticky stage,
 * wheel intercepted while inside the section, released at boundaries.
 */

const CANVAS_W = 1920;
const CANVAS_H = 1080;

interface Step {
  number: string;
  description: React.ReactNode;
  /** Y position in canvas where the active progress-pill sits (Figma 557:847 etc) */
  activePillTop: number;
  /** Image used in the right-side dark panel for this step */
  sceneSrc?: string;
  overlaySrc?: string;
  variant?: "dark-scene" | "green-finale";
}

const STEPS: Step[] = [
  {
    number: "01",
    description:
      "Describe the situation you want to prepare for — a job interview, a first date or something else.",
    activePillTop: 485,
    sceneSrc: "/assets/product-step-01.png",
    variant: "dark-scene",
  },
  {
    number: "02",
    description:
      "Practice with a lifelike avatar, tailored to the situation you’ve described.",
    activePillTop: 507,
    sceneSrc: "/assets/product-step-02-base.png",
    overlaySrc: "/assets/product-step-02-overlay.png",
    variant: "dark-scene",
  },
  {
    number: "03",
    description: (
      <>
        Get actionable, science-based feedback based on the cues you’re
        sending. <span className="opacity-80">(The visual, verbal and vocal cues that determine how other people see you.)</span>
      </>
    ),
    activePillTop: 530,
    sceneSrc: "/assets/product-step-03-base.png",
    overlaySrc: "/assets/product-step-03-overlay.png",
    variant: "dark-scene",
  },
  {
    number: "04",
    description:
      <>
        Track your progress and keep practicing until you become a true{" "}
        <span className="font-semibold italic">social animal.</span>
      </>,
    activePillTop: 551,
    variant: "green-finale",
  },
];

// Frame 71 floating pills — each is positioned in the design at angle θ.
// Position/rotation copied from Figma frame 71 (557:745…772).
const PILLS = [
  { text: "Awkward", left: 286, top: 1765, w: 140, rot: 12.8 },
  { text: "Anxious", left: 119.96, top: 1920.05, w: 124, rot: 48.43 },
  { text: "Shy", left: 378.24, top: 1854.38, w: 80, rot: 19.43 },
  { text: "Afraid", left: 551.92, top: 1660.54, w: 104, rot: 15.29 },
  { text: "Reserved", left: 747.21, top: 1435, w: 140, rot: 48.38 },
  { text: "Nervous", left: 947.33, top: 1619, w: 132, rot: 32.76 },
  { text: "Hesitation", left: 1249.72, top: 1492.97, w: 150, rot: 18.39 },
  { text: "Overthinking", left: 1349.92, top: 1714, w: 180, rot: 57.54 },
  { text: "Insecure", left: 1695.65, top: 1597.06, w: 130, rot: 51.07 },
  { text: "Uneasy", left: 1647.83, top: 1918, w: 120, rot: 15.78 },
];

export function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const activeFrameRef = useRef(0);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    activeFrameRef.current = activeFrame;
    document.documentElement.dataset.productFrame = String(activeFrame);
    return () => {
      document.documentElement.dataset.productFrame = "0";
    };
  }, [activeFrame]);

  const setProductFrame = (nextFrame: number | ((frame: number) => number)) => {
    setActiveFrame((frame) => {
      const next =
        typeof nextFrame === "function" ? nextFrame(frame) : nextFrame;
      activeFrameRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const maxFrame = STEPS.length;

    const handleClick = () => {
      setProductFrame((frame) => (frame > 0 ? Math.min(maxFrame, frame + 1) : frame));
    };

    const moveFrame = (direction: 1 | -1) => {
      const current = activeFrameRef.current;
      if (current === 0) return;
      const next = Math.min(maxFrame, Math.max(1, current + direction));
      if (next === current) return;
      activeFrameRef.current = next;
      setProductFrame(next);
    };

    const handleWheel = (event: WheelEvent) => {
      const current = activeFrameRef.current;
      if (current === 0) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const atStart = current === 1 && direction < 0;
      const atEnd = current === maxFrame && direction > 0;
      if (atStart || atEnd) return;

      event.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 420);
      moveFrame(direction);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionInView = rect.top <= 1 && rect.bottom >= window.innerHeight;
      if (!sectionInView) return;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setProductFrame((frame) => Math.min(maxFrame, Math.max(1, frame + 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setProductFrame((frame) => Math.max(1, frame - 1));
      }
    };

    const stage = stageRef.current;
    window.addEventListener("keydown", handleKey);
    stage?.addEventListener("click", handleClick);
    stage?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKey);
      stage?.removeEventListener("click", handleClick);
      stage?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const resetOnProductNav = () => {
      if (window.location.hash === "#product") {
        setActiveFrame(0);
        activeFrameRef.current = 0;
      }
    };

    window.addEventListener("hashchange", resetOnProductNav);
    return () => window.removeEventListener("hashchange", resetOnProductNav);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative h-screen w-full overflow-hidden"
    >
      <div
        ref={stageRef}
        className="relative h-screen w-screen overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(240.66deg, #f5ebe2 0%, #ffe8d3 99.99%)",
        }}
      >
        {/* Figma 1920×1080 design canvas, responsive scale to viewport */}
        <div
          className="absolute inset-0 mx-auto"
          style={{
            maxWidth: `${CANVAS_W}px`,
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
          }}
        >
          {/* Intro pane — Figma frame 71 left half: "Introducing Social Animal"
              + body + "See how it works" CTA + floating pills in the lower
              region of the canvas. Hidden once user advances to step 01. */}
          <div
            className={`product-intro absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
              activeFrame === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateZ(0)", willChange: "opacity" }}
          >
            <RightDarkPanel />
            <IntroScene />
            <IntroPane onStart={() => setProductFrame(1)} />
            <FloatingPills />
          </div>

          {/* Step panes — only one visible at a time via opacity. */}
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`product-step-${i} absolute inset-0 pointer-events-none transition-opacity ease-out ${
                activeFrame === i + 1 ? "opacity-100 duration-150" : "opacity-0 duration-100"
              }`}
              style={{ transform: "translateZ(0)", willChange: "opacity" }}
            >
              <StepPane step={step} stepIndex={i} />
            </div>
          ))}

          {activeFrame > 0 && (
            <ProductBackButton onBack={() => setProductFrame(0)} />
          )}
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
  // Figma 557:790: right panel (609..1920, 0..1080) but rounded outer.
  // For simplicity we anchor it at left=845 (canvas right half).
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
      <div
        className="absolute inset-0 mix-blend-multiply opacity-25 pointer-events-none"
      >
        <Image
          src="/assets/hero-texture.png"
          alt=""
          fill
          className="object-cover"
          sizes="60vw"
        />
      </div>
      {/* Bottom ink fade — same as Hero, contains scene image bottom */}
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

function IntroPane({ onStart }: { onStart: () => void }) {
  // Figma 557:811: "Introducing / Social Animal" big serif headline at
  // (166, 392), then highlight pill behind "Social Animal", body at y=586,
  // dark CTA pill "See how it works" at (151, 736).
  return (
    <>
      {/* Highlight pill behind "Social Animal" — Figma 557:813
          rect 428×76 at (151, 448), rotate -2.65deg, fill #fff8f3 */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: pct(151, CANVAS_W),
          top: pct(448, CANVAS_H),
          width: pct(428, CANVAS_W),
          height: pct(76, CANVAS_H),
          background: "#fff8f3",
          transform: "rotate(-2.65deg)",
          transformOrigin: "center",
        }}
      />

      {/* "Introducing / Social Animal" — Figma 557:814
          (166, 392), Fedro Med 66 px, color #50091e */}
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

      {/* Body — Figma 557:815: (151, 586, 457×90), Figtree 24/30 #50091e */}
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

      {/* CTA "See how it works" — Figma 557:816, ink pill at (151, 736),
          252.75×63.75, with arrow icon. */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: pct(151, CANVAS_W),
          top: pct(736, CANVAS_H),
          width: pct(252.75, CANVAS_W),
          height: pct(63.75, CANVAS_H),
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStart();
          }}
          className="flex h-full w-full items-center justify-center gap-2 rounded-full bg-ink text-cream font-sans transition-transform hover:scale-[1.02]"
          style={{
            fontSize: "clamp(1rem, 1.17vw, 1.4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          See how it works
          <svg width="20" height="17" viewBox="0 0 23 17" fill="none">
            <path d="M1 8.5h21M15.5 1l7 7.5-7 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
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

function FloatingPills() {
  // Figma 557:745…772: each pill is a rotated rounded rect with text inside.
  // Color: bg #644b62, text #efc5ec, font Figtree Medium 20/43.2.
  // Note: Figma positions these in the y=1435..2042 range (below canvas);
  // they're part of the intro composition which cinematically scrolls past.
  // We display them at ~70-100% of canvas height so they sit at the bottom.
  return (
    <>
      {PILLS.map((p, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            left: pct(p.left, CANVAS_W),
            // Convert pill y from 1435–2042 range to 700–1000 in our canvas
            top: pct(700 + (p.top - 1435) * 0.45, CANVAS_H),
            width: pct(p.w, CANVAS_W),
            height: pct(45, CANVAS_H),
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-full font-sans font-medium"
            style={{
              background: "#644b62",
              color: "#efc5ec",
              fontSize: "clamp(0.75rem, 1.04vw, 1.25rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {p.text}
          </div>
        </div>
      ))}
    </>
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

      {/* Step number — Figma 557:845 etc. (166, 392, 45×34), Figtree
          SemiBold 36 px, color #50091e */}
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

      {/* Step description — Figma 557:844 etc. (166, 486, 474×varies),
          Figtree 30/40 (looks larger than body, ~30-36px), color #50091e */}
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

      {/* Progress indicator — 1 active pill (10×45) + 4 dots (12×12).
          Active pill position varies per step (485, 507, 530, 551). */}
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
    const previousHeight = index === 0 ? 0 : index - 1 === activeIndex ? pillHeight : dotSize;
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

function ProductBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      aria-label="Previous product frame"
      className="pointer-events-auto absolute flex items-center justify-center rounded-full bg-ink text-cream transition-transform hover:scale-[1.04]"
      style={{
        left: pct(151, CANVAS_W),
        top: pct(936, CANVAS_H),
        width: pct(85, CANVAS_W),
        height: pct(85, CANVAS_H),
      }}
      onClick={(event) => {
        event.stopPropagation();
        onBack();
      }}
    >
      <svg
        aria-hidden
        width="28"
        height="24"
        viewBox="0 0 28 24"
        fill="none"
      >
        <path
          d="M26 12H4M12 3L3 12l9 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
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
          sizes="45vw"
        />
      </div>
      <img
        src="/assets/product-step-04-fade.svg"
        alt=""
        className="absolute bottom-0 left-0 w-full"
      />
      <p
        className="absolute text-center tracking-[-0.02em] text-[#415626]"
        style={{
          left: pct(307, 1075),
          top: pct(923, CANVAS_H),
          width: pct(468, 1075),
          fontSize: "clamp(2rem, 3.125vw, 3.75rem)",
          lineHeight: "120px",
        }}
      >
        <span className="font-display italic">Together, </span>
        <span className="font-sans font-medium">we can!</span>
      </p>
    </div>
  );
}

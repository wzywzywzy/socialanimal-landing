import Image from "next/image";
import Link from "next/link";

/**
 * Purpose section — Frame 73 first, then the waitlist CTA footer below.
 */

const CANVAS_W = 1920;
const CANVAS_H = 1760;

// Helpers — Figma global px → % of canvas.
const x = (px: number) => `${(px / CANVAS_W) * 100}%`;
const y = (px: number) => `${(px / CANVAS_H) * 100}%`;
const w = (px: number) => `${(px / CANVAS_W) * 100}%`;
const h = (px: number) => `${(px / CANVAS_H) * 100}%`;

export function Purpose() {
  return (
    <section
      id="purpose"
      className="relative w-full"
      style={{
        backgroundImage: "linear-gradient(240.66deg, #f5ebe2 0%, #ffe8d3 99.99%)",
      }}
    >
      <div
        className="relative mx-auto w-full max-w-[1920px]"
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      >
        {/* Pink ellipse decorative bg — Frame 73 at (0, 252, 1920×828). */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ left: 0, top: y(252), width: w(1920), height: h(828) }}
        >
          <img
            src="/assets/purpose-ellipse.svg"
            alt=""
            className="block w-full h-full"
          />
        </div>

        {/* "Why we're building Social Animal" — Frame 73 at y=549. */}
        <h2
          className="absolute font-display text-center"
          style={{
            left: "50%",
            top: y(549),
            width: w(595),
            transform: "translateX(-50%)",
            color: "#644b62",
            fontSize: "clamp(2.5rem, 3.44vw, 4.125rem)",
            lineHeight: "74px",
            letterSpacing: "-0.02em",
            fontWeight: 500,
            margin: 0,
          }}
        >
          <span className="font-sans font-semibold italic">Why</span> we’re building Social Animal
        </h2>

        {/* Body — Frame 73 at y=743. */}
        <p
          className="absolute font-sans text-center"
          style={{
            left: "50%",
            top: y(743),
            width: w(816),
            transform: "translateX(-50%)",
            color: "#644b62",
            fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
            lineHeight: "30px",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Social ability is more important than ever. And it’s not true that
          “some people have it and some do not”. People skills can be learned.
          And we’re on a mission to build the world’s first great training
          tool. We’re here for everyone who’s ever felt awkward, shy, or under
          appreciated.
        </p>

        {/* Footer starts after the first 1080px frame. */}
        <div
          aria-hidden
          className="absolute left-0 right-0"
          style={{
            top: y(1080),
            height: h(680),
            backgroundImage:
              "linear-gradient(198.35deg, #200009 15%, #28020d 85%)",
          }}
        >
          {/* texture overlay (Figma 557:310): mix-blend-multiply, opacity 25% */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply opacity-25 pointer-events-none"
          >
            <Image
              src="/assets/purpose-footer-texture.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Abstract vector mask (Figma 557:311): decorative swooshes */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <img
              src="/assets/purpose-footer-mask.svg"
              alt=""
              className="block w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Inkpad fade overlay. */}
        <div
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: y(1174),
            height: h(586),
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(to bottom, rgba(40,2,13,0), #28020d)",
          }}
        />

        {/* Footer CTA copy. */}
        <p
          className="absolute font-display text-center text-cream"
          style={{
            left: "50%",
            top: y(1306),
            width: w(767),
            transform: "translateX(-50%)",
            fontSize: "clamp(1.5rem, 2.5vw, 3rem)",
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: 300,
            margin: 0,
          }}
        >
          Want to be among the first to try it?
          <br />
          Sign up for the waitlist here
        </p>

        {/* Footer CTA button. */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: y(1468),
            width: w(244),
            height: h(79.2),
            transform: "translateX(-50%)",
          }}
        >
          <Link
            href="/waitlist"
            className="flex h-full w-full items-center justify-center rounded-full bg-cream text-ink font-sans font-semibold transition-transform hover:scale-[1.03]"
            style={{
              fontSize: "clamp(1.125rem, 1.5vw, 1.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}

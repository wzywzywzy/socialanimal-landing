import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden text-cream" id="top">
      {/* Base gradient — from Figma: linear-gradient(217.9°, #200009 15%, #28020d 85%) */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "linear-gradient(217.93deg, #200009 15.35%, #28020d 84.65%)",
        }}
      />

      {/* Textured overlay — large star motif at 25% opacity, multiply blend */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-multiply opacity-25"
      >
        <Image
          src="/assets/hero-texture.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <Navbar variant="dark" ctaTheme="cream" />

      {/* Content: hero copy */}
      <div className="relative mx-auto flex min-h-screen max-w-[1920px] flex-col items-center px-6 pt-40 md:pt-[380px]">
        <h1 className="font-display text-center text-cream text-[clamp(2.5rem,5.2vw,4.125rem)] leading-[1.05] tracking-[-0.02em] max-w-[720px]">
          Give yourself an{" "}
          <span className="font-sans font-semibold italic">unfair</span>{" "}
          advantage
        </h1>

        <p className="mt-10 max-w-[497px] text-center text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.45] tracking-[-0.02em] text-cream/90">
          Life isn’t fair. It’s much easier for individuals with charisma. But
          the good news is that social skills aren’t fixed – they can be
          learned. And the even better news is that we’re building the first
          great training tool.
        </p>

        {/* CTA sits floating over the phone mockup, just above it */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-6 pt-20 pb-16">
          <p className="text-center text-[clamp(1rem,1.5vw,1.5rem)] leading-[1.2] tracking-[-0.02em] text-cream">
            Want to be among the first to try it?
            <br />
            Sign up for the waitlist here
          </p>
          <Link
            href="/waitlist"
            className="inline-flex h-[66px] items-center justify-center rounded-full bg-cream px-10 text-[24px] font-semibold tracking-[-0.02em] text-ink transition-transform hover:scale-[1.03]"
          >
            Join Waitlist
          </Link>
        </div>
      </div>

      {/* Phone mockup — rises from the bottom edge of the viewport. Sits BEHIND
          the CTA (z-0 vs CTA's z-10) so copy stays readable. */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[952px] aspect-square translate-y-[55%] md:translate-y-[60%]">
        <Image
          src="/assets/hero-phone-mock.png"
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 768px) 90vw, 952px"
          priority
        />
      </div>

      {/* Bottom fade to ink, matches Figma overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[30vh]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(40,2,13,0), #28020d)",
        }}
      />
    </section>
  );
}

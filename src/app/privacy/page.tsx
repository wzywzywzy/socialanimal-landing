import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-cream text-ink"
      style={{
        backgroundImage:
          "linear-gradient(302.78deg, rgba(245, 235, 226, 0.5) 1.44%, rgba(248, 223, 201, 0.5) 98.56%)",
      }}
    >
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1120px] flex-col px-6 py-16 md:py-24">
        <Link
          href="/waitlist"
          aria-label="Back to waitlist"
          className="block h-[69.5px] w-[73.1px] bg-ink transition-transform hover:scale-[1.04]"
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

        <div className="mt-24 max-w-[880px]">
          <h1 className="font-display text-[clamp(3rem,5.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-plum">
            Privacy Policy
          </h1>
          <p className="mt-8 text-[22px] leading-[1.35] tracking-[-0.02em] text-plum">
            Social Animal collects the details you submit on the waitlist only
            to manage early access, send product updates, and understand demand
            for the beta.
          </p>

          <div className="mt-12 space-y-8 text-[18px] leading-[1.45] tracking-[-0.02em] text-plum">
            <p>
              We do not sell your personal information. You can ask us to
              remove your waitlist details at any time.
            </p>
            <p>
              If we add a production privacy policy later, this page should be
              replaced with the company-approved legal text before launch.
            </p>
          </div>

          <Link
            href="/waitlist"
            className="mt-14 inline-flex h-[66px] min-w-[190px] items-center justify-center rounded-full bg-ink px-8 text-[22px] font-semibold tracking-[-0.02em] text-cream transition-transform hover:scale-[1.03]"
          >
            Back
          </Link>
        </div>
      </section>
    </main>
  );
}

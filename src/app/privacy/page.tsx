import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="h-screen overflow-hidden bg-cream text-ink">
      <section
        className="relative h-screen overflow-hidden bg-cream"
        style={{
          backgroundImage:
            "linear-gradient(302.78deg, rgba(245, 235, 226, 0.5) 1.44%, rgba(248, 223, 201, 0.5) 98.56%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light opacity-50"
          style={{
            backgroundImage: "url(/assets/waitlist-noise-texture.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <img
          aria-hidden
          alt=""
          src="/assets/waitlist-corner-shapes.svg"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[155.25vh] min-h-[1200px] w-[136.1vw] min-w-[2100px] -translate-x-[51.4%] -translate-y-[50.4%] max-w-none"
        />

        <Link
          href="/"
          aria-label="Back to Social Animal landing page"
          className="absolute left-1/2 top-[6.6vh] z-10 block h-[69.5px] w-[73.1px] -translate-x-1/2 bg-ink transition-transform hover:scale-[1.04]"
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

        <div className="relative z-10 mx-auto flex h-screen w-full max-w-[1920px] flex-col items-center px-6 pb-[6vh] pt-[19vh] text-center">
          <h1 className="font-display shrink-0 text-[clamp(2.75rem,3.44vw,4.125rem)] font-medium leading-none tracking-[-0.02em] text-plum">
            Join the priority access list
          </h1>

          <div className="relative mt-[40px] flex min-h-0 w-full max-w-[1120px] flex-1">
            <Link
              href="/waitlist"
              aria-label="Back to waitlist"
              className="absolute -left-2 top-[60px] z-10 flex h-[80px] w-[80px] -translate-x-full items-center justify-center rounded-full bg-ink text-cream shadow-[0_10px_30px_rgba(40,2,13,0.18)] transition-transform hover:scale-[1.04]"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M14 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12h12"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            <article className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[32px] bg-white/95 px-[72px] py-[64px] text-left text-ink shadow-[0_30px_80px_rgba(40,2,13,0.06)] [scrollbar-color:#28020d40_transparent] [scrollbar-width:thin]">
              <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.01em]">
                Privacy Policy
              </h2>

              <p className="mt-8 text-[17px] leading-[1.55]">
                Effective date: April 21, 2026
                <br />
                Last updated: April 21, 2026
              </p>

              <p className="mt-8 text-[17px] leading-[1.55]">
                At Social Animal (&ldquo;Social Animal&rdquo;, &ldquo;we&rdquo;,
                &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we believe everyone can
                improve their social skills in a safe, supportive way. Your
                privacy and trust are extremely important to us. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website, join our waitlist,
                or use our service.
              </p>

              <Section title="Information We Collect">
                <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-[1.55]">
                  <li>
                    When you sign up for the waitlist, we collect your email
                    address and first name.
                  </li>
                  <li>
                    We may automatically collect basic technical information
                    such as your IP address, browser type, and device
                    information.
                  </li>
                  <li>
                    We use essential cookies only for basic website
                    functionality (such as enabling the waitlist form to
                    function). We do not use analytics, preference, or
                    advertising cookies at this time.
                  </li>
                </ul>

                <p className="mt-6 text-[17px] leading-[1.55]">
                  When you use Social Animal, we process:
                </p>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-[1.55]">
                  <li>Audio recordings of your voice during roleplay sessions.</li>
                  <li>
                    Video recordings (including facial expressions and body
                    language).
                  </li>
                  <li>Conversation content and interaction data.</li>
                </ul>

                <p className="mt-6 text-[17px] leading-[1.55]">
                  Voice and video data are special categories of personal data
                  (biometric data) under GDPR. We only process this data with
                  your explicit consent and solely to provide realistic
                  roleplay practice and science-based feedback on your social
                  skills.
                </p>
              </Section>

              <Section title="How We Use Your Information">
                <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-[1.55]">
                  <li>
                    To add you to our waitlist and send you updates about access
                    and product improvements.
                  </li>
                  <li>To respond to your inquiries.</li>
                  <li>
                    To deliver personalized roleplay sessions, generate feedback
                    on visual, vocal, and verbal cues, track your progress, and
                    improve our service.
                  </li>
                  <li>
                    For internal analytics and product development using
                    aggregated or anonymized data where possible.
                  </li>
                </ul>
                <p className="mt-6 text-[17px] font-medium leading-[1.55]">
                  We never sell your personal data.
                </p>
              </Section>

              <Section title="Legal Basis for Processing (GDPR)">
                <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-[1.55]">
                  <li>
                    <span className="font-semibold">Consent:</span> For waitlist
                    sign-ups and for processing voice and video recordings.
                  </li>
                  <li>
                    <span className="font-semibold">Legitimate interests:</span>{" "}
                    To operate, maintain, and improve the website and service.
                  </li>
                </ul>
              </Section>

              <Section title="Sharing Your Information">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  We may share your data with trusted service providers (such
                  as email platforms or hosting providers) who are bound by
                  strict data processing agreements. We do not transfer
                  personal data outside the EU/EEA without appropriate
                  safeguards, such as Standard Contractual Clauses or the
                  EU-US Data Privacy Framework (where applicable). Voice and
                  video recordings are not shared with third parties except
                  where strictly necessary to provide the service under the
                  same privacy standards.
                </p>
              </Section>

              <Section title="Data Retention">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  We keep your waitlist data only as long as necessary or until
                  you unsubscribe. Session recordings (voice and video) are
                  retained only for the time needed to provide feedback and
                  progress tracking, after which they are deleted or
                  anonymized.
                </p>
              </Section>

              <Section title="Your Rights">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  You have the right to access, correct, delete, or restrict
                  processing of your personal data, to withdraw consent, and
                  to data portability. If you have any concerns about how we
                  handle your data, we encourage you to contact us first so we
                  can try to resolve the issue. You also have the right to
                  lodge a complaint with the Swedish Authority for Privacy
                  Protection (IMY) or your local supervisory authority.
                </p>
              </Section>

              <Section title="Security">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  We use reasonable technical and organizational measures to
                  protect your data. No system is 100% secure.
                </p>
              </Section>

              <Section title="Children's Privacy">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  Social Animal is intended for users 18 years and older. We do
                  not knowingly collect data from children under 18.
                </p>
              </Section>

              <Section title="Changes to This Privacy Policy">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  We may update this policy. Material changes will be notified
                  via the website and, where appropriate, by email.
                </p>
              </Section>

              <Section title="Contact Us">
                <p className="mt-4 text-[17px] leading-[1.55]">
                  Email:{" "}
                  <a
                    href="mailto:privacy@socialanimal.ai"
                    className="underline decoration-1 underline-offset-2"
                  >
                    privacy@socialanimal.ai
                  </a>
                </p>
                <p className="mt-3 text-[17px] leading-[1.55]">
                  Social Animal, Stockholm, Sweden
                </p>
              </Section>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h3 className="text-[20px] font-bold leading-[1.3] tracking-[-0.01em]">
        {title}
      </h3>
      {children}
    </section>
  );
}

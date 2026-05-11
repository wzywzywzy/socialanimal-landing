"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export default function WaitlistPage() {
  const [registered, setRegistered] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const consentEmail = formData.get("emailConsent") === "on";
    const consentPrivacy = formData.get("privacyConsent") === "on";

    if (!firstName || !email) {
      setStatus({ kind: "error", message: "Please fill in your name and email." });
      return;
    }
    if (!consentPrivacy) {
      setStatus({
        kind: "error",
        message: "Please agree to the Privacy Policy to continue.",
      });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, consentEmail, consentPrivacy }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        const message =
          body.error === "invalid_input"
            ? "Please check your email address and try again."
            : "Something went wrong. Please try again in a moment.";
        setStatus({ kind: "error", message });
        return;
      }

      const body = (await res.json()) as { alreadyRegistered?: boolean };
      setAlreadyRegistered(Boolean(body.alreadyRegistered));
      setRegistered(true);
      setStatus({ kind: "idle" });
      window.history.replaceState(null, "", "/waitlist#registered");
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-ink">
      <section
        className="relative min-h-screen overflow-hidden bg-cream"
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

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center px-6 pt-[27.3vh] text-center">
          {registered ? (
            <SuccessState alreadyRegistered={alreadyRegistered} />
          ) : (
            <>
              <h1 className="font-display text-[clamp(2.75rem,3.44vw,4.125rem)] font-medium leading-none tracking-[-0.02em] text-plum">
                Join the priority access list
              </h1>

              <p className="mt-6 max-w-[810px] text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.25] tracking-[-0.02em] text-plum">
                Enter your details to be one of the first to experience Social
                Animal.
                <br />
                Unlock exclusive early access and start building your social
                confidence sooner.
              </p>

              <form
                aria-label="Priority access form"
                className="mt-[69px] flex w-full max-w-[798px] flex-col items-center"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="first-name">
                  First Name
                </label>
                <FrostedInput
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="First Name"
                  required
                  disabled={submitting}
                />

                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <FrostedInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className="mt-[30px]"
                  required
                  disabled={submitting}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-[30px] h-[66px] w-[221px] rounded-full bg-ink text-[24px] font-semibold leading-[28.8px] tracking-[-0.02em] text-cream transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {submitting ? "Submitting…" : "Register Now"}
                </button>

                {status.kind === "error" && (
                  <p
                    role="alert"
                    className="mt-6 max-w-[600px] text-[18px] leading-6 tracking-[-0.02em] text-[#a14a4a]"
                  >
                    {status.message}
                  </p>
                )}

                <div className="mt-[42px] grid w-full grid-cols-[24px_minmax(0,1fr)] gap-x-[18px] gap-y-6 text-left text-[18px] font-medium leading-6 tracking-[-0.02em] text-[#ccac8f]">
                  <input
                    id="email-consent"
                    name="emailConsent"
                    type="checkbox"
                    className="mt-0 size-6 appearance-none rounded-[6px] bg-[#ecd8c5] checked:bg-ink"
                  />
                  <label htmlFor="email-consent">
                    I consent to receiving reminder emails and occasional
                    promotional emails about Social Animal. I understand I can
                    unsubscribe or opt out at any time.
                  </label>

                  <input
                    id="privacy-consent"
                    name="privacyConsent"
                    type="checkbox"
                    className="mt-0 size-6 appearance-none rounded-[6px] bg-[#ecd8c5] checked:bg-ink"
                    required
                  />
                  <label htmlFor="privacy-consent">
                    By registering, I agree to the{" "}
                    <Link
                      href="/privacy"
                      className="underline decoration-solid underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function SuccessState({ alreadyRegistered }: { alreadyRegistered: boolean }) {
  return (
    <div className="flex w-full max-w-[900px] flex-col items-center text-center">
      <h1 className="font-display text-[clamp(4rem,6.8vw,8rem)] font-medium leading-[0.9] tracking-[-0.02em] text-plum">
        {alreadyRegistered ? "You're already in" : "You are in"}
      </h1>
      <p className="mt-9 max-w-[710px] text-[clamp(1.125rem,1.35vw,1.625rem)] leading-[1.25] tracking-[-0.02em] text-plum">
        {alreadyRegistered ? (
          <>
            Looks like this email is already on the priority access list.
            <br />
            We&apos;ll be in touch as soon as your early access is ready.
          </>
        ) : (
          <>
            Thanks for joining Social Animal&apos;s priority access list.
            <br />
            We&apos;ll let you know as soon as your early access is ready.
          </>
        )}
      </p>
      <Link
        href="/"
        className="mt-16 flex h-[79px] w-[244px] items-center justify-center rounded-full bg-ink text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-cream transition-transform hover:scale-[1.03]"
      >
        Back Home
      </Link>
    </div>
  );
}

function FrostedInput({
  className = "",
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`h-[95px] w-full rounded-full border-2 border-[#fffefe]/70 bg-[#ead8c5]/75 px-[42px] text-[28px] tracking-[-0.03em] text-plum outline-none backdrop-blur-[40px] placeholder:text-[#c8ad93] focus:border-white/90 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      style={{
        backgroundBlendMode: "normal, soft-light, normal",
        backgroundImage:
          "linear-gradient(160.49deg, rgba(255,248,241,0.78) 0%, rgba(234,216,197,0.74) 119.12%), url(/assets/waitlist-input-texture.png), linear-gradient(0deg, #ead8c5, #ead8c5)",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      {...props}
    />
  );
}

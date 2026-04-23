import Link from "next/link";

type Section = "problem" | "product" | "purpose";

type Variant =
  | "dark"     // light text for use over dark/image backgrounds
  | "light";   // dark text for use over cream/pink backgrounds

interface NavbarProps {
  active?: Section;
  variant?: Variant;
  /** Join Waitlist pill fill — defaults to ink; pass "cream" when the bar sits on ink backgrounds. */
  ctaTheme?: "ink" | "cream";
}

const LINKS: { id: Section; label: string; href: string }[] = [
  { id: "problem", label: "Problem", href: "#problem" },
  { id: "product", label: "Product", href: "#product" },
  { id: "purpose", label: "Purpose", href: "#purpose" },
];

export function Navbar({ active, variant = "light", ctaTheme = "ink" }: NavbarProps) {
  const textColor = variant === "dark" ? "text-cream" : "text-ink";
  const ctaBg = ctaTheme === "ink" ? "bg-ink text-cream" : "bg-cream text-ink";

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6 md:pt-[53px]">
      <div className="pointer-events-auto w-full max-w-[1479px] h-[70px] md:h-[105px] rounded-full border-4 border-white/50 bg-white/10 backdrop-blur-[15px] flex items-center justify-between px-4 md:px-8 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
        <Link href="/" aria-label="Social Animal home" className="flex items-center">
          {/* Logo asset is cream-filled. On light backgrounds, tint via CSS mask.
              Explicit width/height because the source SVG has preserveAspectRatio="none". */}
          <span
            aria-hidden
            className={`block h-10 md:h-[70px] w-[42px] md:w-[73px] ${
              variant === "dark" ? "bg-cream" : "bg-ink"
            }`}
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
        </Link>

        <nav className={`hidden md:flex items-center gap-[110px] text-[28px] tracking-[-0.02em] ${textColor}`}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`transition-opacity hover:opacity-100 ${
                active === link.id ? "font-semibold opacity-100" : "font-light opacity-80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/waitlist"
          className={`flex h-[56px] md:h-[70px] items-center justify-center rounded-full px-6 md:px-10 text-base md:text-[24px] font-semibold tracking-[-0.02em] transition-transform hover:scale-[1.02] ${ctaBg}`}
        >
          Join Waitlist
        </Link>
      </div>
    </header>
  );
}

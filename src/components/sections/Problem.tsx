import Image from "next/image";

/**
 * Problem section is a single continuous long canvas. In Figma this is
 * authored as one 1920×2280 scene (nodes 557:637 and 557:672 are just
 * two framings of the SAME canvas, and 557:996 is a mid-scroll capture
 * that confirms the shared global Y axis — e.g. the green card sits at
 * y=631 in 557:637, at y=333 in 557:996, and at y=-569 in 557:672,
 * meaning those framings differ only by camera offset).
 *
 * Global Y layout on the long canvas:
 *   0 ……………… top of 3A viewport
 *   631          green card (Nadella)
 *   755          blue card (Dimon)
 *   989          green-card bottom
 *   1080         end of 3A viewport framing
 *   1200         start of 3B viewport framing (blue panel top)
 *   1619         heading "Improve your social ability …"
 *   2280         3B viewport bottom (blue panel bottom / man portrait bottom)
 *
 * Total canvas: 1920 × 2280, aspect 1920/2280.
 */

const CANVAS_W = 1920;
const CANVAS_H = 2280;

// Helper to turn a Figma-global pixel coord into a % of the long canvas.
const x = (px: number) => `${(px / CANVAS_W) * 100}%`;
const y = (px: number) => `${(px / CANVAS_H) * 100}%`;
const w = (px: number) => `${(px / CANVAS_W) * 100}%`;
const h = (px: number) => `${(px / CANVAS_H) * 100}%`;

export function Problem() {
  return (
    <section
      id="importance"
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(240.66deg, #f5ebe2 0%, #ffe8d3 100%)",
      }}
    >
      {/* Desktop: one long canvas, 1920×2280 aspect, anchored to max-1920 */}
      <div
        className="relative hidden md:block mx-auto w-full max-w-[1920px]"
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      >
        <span
          id="problem"
          aria-hidden
          className="absolute left-0 block h-px w-px"
          style={{ top: y(1200) }}
        />

        {/* ── 3A layer ─────────────────────────────────────────── */}

        {/* 557:643 — centered headline at y ≈ 540 (3A viewport center minus 66)
            In the 3A framing: top = calc(50% - 66). With 3A framing starting
            at global y=0 and ending at 1080, center is y=540, so the headline
            sits at global y ≈ 474..540. */}
        <h2
          className="font-display absolute left-1/2 -translate-x-1/2 text-center text-plum"
          style={{
            top: y(474),             // 540 - 66
            width: w(926),           // 926/1920
            fontSize: "clamp(2.5rem, 3.44vw, 4.125rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          People skills will be even more important going forward.
        </h2>

        {/* 557:651 — Green Nadella card (143, 631, 529×358) */}
        <QuoteCard
          variant="solid"
          tone="green"
          style={{ left: x(143), top: y(631), width: w(529), height: h(358) }}
          quote="“When AI takes over more analytical and technical tasks, emotional intelligence becomes more important.”"
          quoteStyle={{
            left: "12.1%",          // 64/529 of the card
            top: "16.2%",           // 58/358 of the card
            width: "79.4%",         // 420/529
            fontSize: 28,
            lineHeight: "32px",
          }}
          name="Satya Nadella,"
          title="CEO of Microsoft."
          bylineStyle={{ left: "12.1%", top: "65.36%", width: "40.08%" }}
          avatar="/assets/avatar-nadella.png"
          avatarStyle={{ left: x(507), top: y(825) }}
        />

        {/* 557:638 — Pink Colvin blob (1199, 189, 529×319.5) */}
        <QuoteCard
          variant="blob"
          tone="pink"
          style={{ left: x(1199), top: y(189), width: w(529), height: h(319.5) }}
          quote="“The most valuable skills in the AI age won’t be technical, they’ll be human.”"
          quoteStyle={{
            left: "12.1%",
            top: "18.62%",           // 59.5/319.5
            width: "70.9%",          // 375/529
            fontSize: 28,
            lineHeight: "32px",
            fontWeight: 500,
          }}
          name="Geoff Colvin,"
          title="Expert on the future of work."
          bylineStyle={{ left: "12.1%", top: "61.19%", width: "40.08%" }}
          avatar="/assets/avatar-colvin.png"
          avatarStyle={{ left: x(1563), top: y(344.5) }}
        />

        {/* 557:644 — Blue Dimon card (980, 755, 529×358) */}
        <QuoteCard
          variant="solid"
          tone="blue"
          style={{ left: x(980), top: y(755), width: w(529), height: h(358) }}
          quote="”Soft skills like emotional intelligence and communication will be vital when AI eliminates many jobs.”"
          quoteStyle={{
            left: "12.1%",
            top: "16.2%",
            width: "78.45%",         // 415/529
            fontSize: 28,
            lineHeight: "36px",      // NB: larger leading than the others
          }}
          name="Jamie Dimon,"
          title="CEO of JP Morgan Chase."
          bylineStyle={{ left: "12.1%", top: "65.36%", width: "40.08%" }}
          avatar="/assets/avatar-dimon.png"
          avatarStyle={{ left: x(1344), top: y(949), withBackdrop: true }}
        />

        {/* ── 3B layer ─────────────────────────────────────────── */}

        {/* 557:710 — blue panel (0, 1200, 1080×1080) */}
        <div
          aria-hidden
          className="absolute rounded-[20px] bg-quote-blue"
          style={{
            left: 0,
            top: y(1200),
            width: w(1080),
            height: h(1080),
          }}
        />

        {/* 557:711 — star outline (114, 1358, 828.4×787.86) */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: x(114),
            top: y(1358),            // 1200 + 158
            width: w(828.4),
            height: h(787.86),
          }}
        >
          <img
            src="/assets/hero-star-outline.svg"
            alt=""
            className="block h-full w-full"
          />
        </div>

        {/* 557:718 — man portrait (161.92, 1527, 717×753) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: x(161.92),
            top: y(1527),            // 1200 + 327
            width: w(717),
            height: h(753),
          }}
        >
          <Image
            src="/assets/problem-man.png"
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="37vw"
          />
        </div>

        {/* 557:736 — cream highlight rectangle for "watching"
            Figma frame: (1457.7, 565.39, 324.484×76, rotate -2.65°)
            Global Y: 1200 + 565.39 = 1765.39 */}
        <div
          aria-hidden
          className="absolute"
          style={{
            left: x(1457.7),
            top: y(1765.39),
            width: w(324.484),
            height: h(76),
            background: "#fff8f3",
            transform: "rotate(-2.65deg)",
            transformOrigin: "center",
          }}
        />

        {/* 557:737 — heading (1205, 1619, 595×194). 66px / 74px leading
            Global Y: 1200 + 419 = 1619 */}
        <h2
          className="absolute font-display text-plum"
          style={{
            left: x(1205),
            top: y(1619),
            width: w(595),
            fontSize: "clamp(2.25rem, 3.44vw, 4.125rem)",
            lineHeight: "74px",
            letterSpacing: "-0.02em",
          }}
        >
          Improve your social ability without anybody{" "}
          <span className="font-sans font-semibold italic">watching</span>.
        </h2>

        {/* 557:738 — body copy (1205, 1903, 568×120)
            Global Y: 1200 + 703 = 1903 */}
        <p
          className="absolute text-plum font-sans"
          style={{
            left: x(1205),
            top: y(1903),
            width: w(568),
            fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
            lineHeight: "30px",
            letterSpacing: "-0.02em",
          }}
        >
          There are lots of videos and books to help boost your people
          skills, but to actually improve you need to practice. And until
          now, you could only do it in the very situations you wanted to
          prepare for.
        </p>
      </div>

      {/* Mobile: stacked fallback */}
      <div className="md:hidden px-6 pt-28 pb-24">
        <h2 className="font-display text-center text-plum text-[clamp(2rem,8vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
          People skills will be even more important going forward.
        </h2>
        <div className="mt-12 flex flex-col gap-8">
          <MobileQuote
            tone="green"
            quote="“When AI takes over more analytical and technical tasks, emotional intelligence becomes more important.”"
            name="Satya Nadella,"
            title="CEO of Microsoft."
            avatar="/assets/avatar-nadella.png"
          />
          <MobileQuote
            tone="pink"
            quote="“The most valuable skills in the AI age won’t be technical, they’ll be human.”"
            name="Geoff Colvin,"
            title="Expert on the future of work."
            avatar="/assets/avatar-colvin.png"
          />
          <MobileQuote
            tone="blue"
            quote="”Soft skills like emotional intelligence and communication will be vital when AI eliminates many jobs.”"
            name="Jamie Dimon,"
            title="CEO of JP Morgan Chase."
            avatar="/assets/avatar-dimon.png"
          />
        </div>

        <div className="mt-20 relative mx-auto flex h-[420px] w-full max-w-[480px] items-end justify-center rounded-[20px] bg-quote-blue overflow-hidden">
          <img
            src="/assets/hero-star-outline.svg"
            alt=""
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] opacity-95"
          />
          <Image
            src="/assets/problem-man.png"
            alt=""
            width={600}
            height={628}
            className="relative h-full w-auto object-contain object-bottom"
            sizes="80vw"
          />
        </div>
        <h2 className="mt-10 font-display text-plum text-[clamp(2rem,8vw,2.75rem)] leading-[1.12] tracking-[-0.02em]">
          Improve your social ability without anybody{" "}
          <span className="relative inline-block">
            <span
              aria-hidden
              className="absolute inset-x-0 -z-10"
              style={{
                top: "32%",
                bottom: "6%",
                background: "#fff8f3",
                transform: "rotate(-2.65deg)",
              }}
            />
            <span className="font-sans font-semibold italic">watching</span>
          </span>
          .
        </h2>
        <p className="mt-6 text-plum text-[clamp(1rem,4vw,1.25rem)] leading-[1.35] tracking-[-0.02em]">
          There are lots of videos and books to help boost your people
          skills, but to actually improve you need to practice. And until
          now, you could only do it in the very situations you wanted to
          prepare for.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────── Shared quote-card primitives ───────────────────── */

type Tone = "green" | "pink" | "blue";

interface QuoteCardProps {
  variant: "solid" | "blob";
  tone: Tone;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  style: React.CSSProperties;
  quoteStyle: React.CSSProperties;
  bylineStyle: React.CSSProperties;
  avatarStyle: React.CSSProperties & { withBackdrop?: boolean };
}

const TONE: Record<Tone, { bg: string; quoteInk: string; bylineInk: string }> = {
  green: { bg: "bg-quote-green", quoteInk: "text-quote-green-ink", bylineInk: "text-quote-green-ink" },
  pink:  { bg: "bg-quote-pink",  quoteInk: "text-quote-pink-ink",  bylineInk: "text-quote-pink-ink" },
  blue:  { bg: "bg-quote-blue",  quoteInk: "text-quote-blue-ink",  bylineInk: "text-quote-blue-ink" },
};

function QuoteCard({
  variant,
  tone,
  quote,
  name,
  title,
  avatar,
  style,
  quoteStyle,
  bylineStyle,
  avatarStyle,
}: QuoteCardProps) {
  const { bg, quoteInk, bylineInk } = TONE[tone];
  const { withBackdrop, ...avatarPos } = avatarStyle;

  const quoteFontSize = typeof quoteStyle.fontSize === "number"
    ? `clamp(0.95rem, ${(quoteStyle.fontSize / CANVAS_W) * 100}vw, ${quoteStyle.fontSize / 16}rem)`
    : quoteStyle.fontSize;

  const quoteLineHeight = typeof quoteStyle.lineHeight === "string"
    && quoteStyle.lineHeight.endsWith("px")
    && typeof quoteStyle.fontSize === "number"
    ? `${Number(quoteStyle.lineHeight.replace("px", "")) / quoteStyle.fontSize}`
    : quoteStyle.lineHeight;

  return (
    <>
      <div className="absolute" style={style}>
        {variant === "solid" ? (
          <div
            aria-hidden
            className={`absolute inset-0 ${bg} rounded-[45px] rounded-br-[120px]`}
          />
        ) : (
          <img
            aria-hidden
            src="/assets/quote-pink-blob.svg"
            alt=""
            className="absolute inset-0 w-full h-full"
          />
        )}

        <p
          className={`absolute font-sans italic tracking-[-0.02em] ${quoteInk}`}
          style={{
            ...quoteStyle,
            fontSize: quoteFontSize,
            lineHeight: quoteLineHeight,
            fontStyle: "italic",
          }}
        >
          {quote}
        </p>
        <p
          className={`absolute italic tracking-[-0.02em] ${bylineInk}`}
          style={{
            ...bylineStyle,
            fontSize: "clamp(0.75rem, 0.83vw, 1rem)",
            lineHeight: "20px",
          }}
        >
          -{" "}
          <span className="font-medium not-italic">{name}</span>
          <br />
          <span className="font-light ml-2">{title}</span>
        </p>
      </div>

      {/* Avatar is on the canvas, not the card — lets it overhang */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: w(120),
          aspectRatio: "1 / 1",
          ...avatarPos,
        }}
      >
        {withBackdrop && (
          <div aria-hidden className="absolute inset-0 bg-[#e9ebed] rounded-full" />
        )}
        <Image
          src={avatar}
          alt=""
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>
    </>
  );
}

/* ───────────────────── Mobile stacked quote ───────────────────── */

interface MobileQuoteProps {
  tone: Tone;
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

function MobileQuote({ tone, quote, name, title, avatar }: MobileQuoteProps) {
  const { bg, quoteInk } = TONE[tone];
  return (
    <div className={`relative rounded-[35px] rounded-br-[90px] p-7 ${bg} ${quoteInk}`}>
      <p className="font-sans italic text-[clamp(1rem,4.5vw,1.25rem)] leading-[1.3] tracking-[-0.02em]">
        {quote}
      </p>
      <div className="mt-6 flex items-end justify-between gap-3">
        <p className="italic text-sm leading-tight">
          - <span className="font-medium not-italic">{name}</span>
          <br />
          <span className="font-light ml-2">{title}</span>
        </p>
        <Image
          src={avatar}
          alt=""
          width={88}
          height={88}
          className="h-[72px] w-[72px] rounded-full object-cover shrink-0"
        />
      </div>
    </div>
  );
}

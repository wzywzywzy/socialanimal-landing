import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const fedro = localFont({
  variable: "--font-fedro",
  display: "swap",
  src: [
    { path: "../../public/fonts/fedro/fedro-regular-webfont.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/fedro/fedro-italic-webfont.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/fedro/fedro-medium-webfont.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/fedro/fedro-mediumitalic-webfont.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/fedro/fedro-semibold-webfont.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/fedro/fedro-semibolditalic-webfont.woff2", weight: "600", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Social Animal — Give yourself an unfair advantage",
  description:
    "Social Animal is an AI-powered tool to practice, improve and gain real social confidence — on your own.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${fedro.variable} antialiased`}
    >
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import EndBounce from "@/components/EndBounce";

// EB Garamond, served from this site (no third-party font requests).
const garamond = localFont({
  src: [
    { path: "./fonts/EBGaramond-VariableFont_wght.woff2", style: "normal", weight: "400 800" },
    { path: "./fonts/EBGaramond-Italic-VariableFont_wght.woff2", style: "italic", weight: "400 800" },
  ],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beck To Nature",
  description: "Beck To Nature takes Central European manufacturers to US trade shows: the right show, buyers booked before you fly, and every lead followed up.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo/favicon-gold.svg` },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#121211", colorScheme: "dark" };

// Runs before the first paint: "fx" switches the scroll experience on, unless the visitor asked for reduced motion.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('fx')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={garamond.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body>{children}<EndBounce /></body>
    </html>
  );
}

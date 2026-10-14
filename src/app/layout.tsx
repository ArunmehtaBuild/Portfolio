import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Archivo: body and wide display caps (variable width axis).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Instrument Serif: large statements and italic accents.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// IBM Plex Mono: bearings, labels and figures.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const description =
  "Builder and operator. Director & COO at Nexera, B.Tech CSE at GGSIPU. A map of the problems I’ve worked on, from ocean heat to network attacks, and the one I haven’t found yet.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Arun Mehta · Problem Atlas",
  description,
  authors: [{ name: "Arun Mehta" }],
  openGraph: {
    type: "profile",
    title: "Arun Mehta · Problem Atlas",
    description,
    url: "/",
    siteName: "Arun Mehta",
  },
  twitter: { card: "summary_large_image", title: "Arun Mehta · Problem Atlas", description },
};

export const viewport: Viewport = {
  themeColor: "#08121a",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Without JS, reveal animations never run, so show everything in place. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen">
        <SmoothScroll>
          {children}
          {modal}
        </SmoothScroll>
      </body>
    </html>
  );
}

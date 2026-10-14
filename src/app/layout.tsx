import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee3" },
    { media: "(prefers-color-scheme: dark)", color: "#0e181c" },
  ],
};

// Applies a saved theme choice before first paint so the page never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

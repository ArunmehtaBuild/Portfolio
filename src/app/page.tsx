import { ActiveStopProvider } from "@/components/atlas/ActiveStop";
import { AtlasStrip } from "@/components/atlas/AtlasStrip";
import { MiniMap } from "@/components/atlas/MiniMap";
import { SiteHeader } from "@/components/atlas/SiteHeader";
import { Hero } from "@/components/hero/Hero";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { NexeraRegion } from "@/components/region/NexeraRegion";
import { ProjectRegion } from "@/components/region/ProjectRegion";
import { CivicSetu } from "@/components/sections/CivicSetu";
import { Contact } from "@/components/sections/Contact";
import { Milestones } from "@/components/sections/Milestones";
import { Unmapped } from "@/components/sections/Unmapped";
import { stops } from "@/data/atlas";
import { profile } from "@/data/profile";
import { regions } from "@/data/regions";
import { siteUrl } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: "Director & COO",
  worksFor: { "@type": "Organization", name: "Nexera", url: "https://nexeraofficial.in/" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Guru Gobind Singh Indraprastha University" },
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  sameAs: profile.links.map((l) => l.href),
};

export default function Home() {
  return (
    <SmoothScroll>
      <ActiveStopProvider stops={stops}>
        <a
          href="#nexera"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to the atlas
        </a>
        <SiteHeader />
        <MiniMap />
        <AtlasStrip />

        <main className="overflow-x-clip">
          <Hero />
          <NexeraRegion />
          {regions.map((region) => (
            <ProjectRegion key={region.slug} region={region} />
          ))}
          <CivicSetu />
          <Milestones />
          <Unmapped />
          <Contact />
        </main>

        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-6 pb-10 font-mono text-[0.7rem] text-muted sm:px-8">
            <span>© 2026 Arun Mehta</span>
            <span>Every figure is sourced. Team results are marked as team results.</span>
          </div>
        </footer>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </ActiveStopProvider>
    </SmoothScroll>
  );
}

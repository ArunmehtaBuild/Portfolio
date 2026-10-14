import { AtlasMap } from "@/components/AtlasMap";
import { CivicSetuRegion } from "@/components/CivicSetuRegion";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Milestones } from "@/components/Milestones";
import { NexeraRegion } from "@/components/NexeraRegion";
import { ProjectRegion } from "@/components/ProjectRegion";
import { SiteHeader } from "@/components/SiteHeader";
import { Unmapped } from "@/components/Unmapped";
import { stops } from "@/data/atlas";
import { profile } from "@/data/profile";
import { regions } from "@/data/regions";
import { siteUrl } from "@/lib/site";

const ids = stops.map((s) => s.id);

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
    <div className="overflow-x-clip">
      <a href="#nexera" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to the atlas
      </a>
      <SiteHeader stops={stops} ids={ids} />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden pt-16 lg:block">
          <AtlasMap stops={stops} ids={ids} />
        </aside>

        <main className="max-w-[44rem] min-w-0">
          <Hero />
          <NexeraRegion />
          {regions.map((region) => (
            <ProjectRegion key={region.slug} region={region} />
          ))}
          <CivicSetuRegion />
          <Milestones />
          <Unmapped />
          <Contact />
        </main>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-[0.72rem] text-faint sm:px-6">
          <span>© 2026 Arun Mehta</span>
          <span>Every figure on this page is sourced. Team results are marked as team results.</span>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    </div>
  );
}

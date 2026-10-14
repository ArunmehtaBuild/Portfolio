import { civicSetu } from "@/data/regions";
import { FadeUp } from "../motion/Reveal";

// A small region on purpose: where Arun started, stated plainly.
export function CivicSetu() {
  return (
    <section id={civicSetu.slug} data-stop={civicSetu.slug} aria-labelledby={`${civicSetu.slug}-title`} className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeUp className="grid gap-8 rounded-3xl border border-line p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="label">{civicSetu.bearing}</p>
          <h2 id={`${civicSetu.slug}-title`} className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1] font-semibold tracking-[-0.02em]">
            {civicSetu.title}
          </h2>
          <p className="mt-5 flex items-center gap-3">
            <span className="wide text-[0.95rem]">{civicSetu.project}</span>
            <span className="font-mono text-[0.75rem] text-muted">{civicSetu.context}</span>
          </p>
        </div>
        <p className="text-[1.08rem] leading-[1.7] text-muted lg:col-span-7">{civicSetu.text}</p>
      </FadeUp>
    </section>
  );
}

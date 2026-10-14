import { offTheMap } from "@/data/profile";
import { FadeUp } from "../motion/Reveal";

// A small, quiet section before Contact: what Arun does away from the keyboard.
export function OffTheBoard() {
  return (
    <section aria-labelledby="off-title" className="mx-auto max-w-7xl px-5 pt-10 pb-6 sm:px-8">
      <div className="flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-start md:gap-16">
        <h2 id="off-title" className="shrink-0 md:w-56">
          <span className="label block">Off the board</span>
          <span className="mt-2 block font-serif text-[1.9rem] leading-none italic">Outside the terminal</span>
        </h2>
        <ul className="grid flex-1 gap-3 sm:grid-cols-2">
          {offTheMap.map((item, i) => (
            <FadeUp as="li" key={item.heading} delay={i * 0.08} className="flex items-baseline gap-4 rounded-2xl border border-line bg-card/70 p-5 backdrop-blur-sm">
              <span className="wide text-[0.95rem]">{item.heading}</span>
              <span className="text-[0.95rem] leading-[1.55] text-muted">{item.text}</span>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

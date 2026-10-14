import { unmapped } from "@/data/profile";

// The empty part of the map: the problem Arun hasn't found yet. Deliberately blank and dashed.
export function Unmapped() {
  return (
    <section id="unmapped" data-stop="unmapped" aria-labelledby="unmapped-title" className="scroll-mt-24 border-t border-line pt-14 pb-20 sm:pt-20 sm:pb-28">
      <p className="label">Region 08 · Uncharted</p>
      <div className="relative mt-6 overflow-hidden rounded-sm border-2 border-dashed border-contour px-6 py-12 sm:px-12 sm:py-16">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none">
          <defs>
            <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="14" style={{ stroke: "var(--contour)" }} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch)" opacity="0.35" />
        </svg>
        <div className="relative max-w-[34rem] bg-paper/85 p-1">
          <h2 id="unmapped-title" className="text-[2rem] leading-[1.1] font-medium italic sm:text-[2.6rem]">
            {unmapped.title}
          </h2>
          <div className="mt-6 space-y-4 text-[1.13rem] leading-[1.7]">
            {unmapped.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="label mt-8">Here be problems worth solving</p>
        </div>
      </div>
    </section>
  );
}

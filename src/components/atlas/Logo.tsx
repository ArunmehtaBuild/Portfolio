import Link from "next/link";

// Monogram: wide Archivo capitals between chart registration marks, with a survey dot.
// Used top-left on every page.
export function Logo() {
  return (
    <Link href="/" aria-label="Arun Mehta, home" className="group flex items-center gap-3">
      <span className="relative grid h-10 w-[3.4rem] place-items-center">
        {["top-0 left-0 border-t-2 border-l-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
          <span
            key={c}
            aria-hidden="true"
            className={`absolute size-2.5 border-fg transition-all duration-300 group-hover:size-3.5 group-hover:border-accent ${c}`}
          />
        ))}
        <span className="wide text-[1.05rem] leading-none tracking-[0.02em]">
          AM<span className="text-accent">.</span>
        </span>
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[0.92rem] font-semibold tracking-[-0.01em]">Arun Mehta</span>
        <span className="font-mono text-[0.62rem] tracking-[0.14em] text-muted uppercase">Problem Atlas</span>
      </span>
    </Link>
  );
}

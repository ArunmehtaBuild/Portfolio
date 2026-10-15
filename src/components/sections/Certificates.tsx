import Image from "next/image";
import { certificates, type Certificate } from "@/data/certificates";

// A strip of certificate photos that keeps drifting sideways on its own. Only certificates
// with an image are shown; until there is at least one, the section stays hidden.
export function Certificates() {
  const shown = certificates.filter((c) => c.image);
  if (shown.length === 0) return null;
  // Repeat short lists so one lap is wider than the screen, then render the lap twice so
  // the loop is seamless (the second copy is hidden from assistive tech).
  const lap = Array.from({ length: Math.max(1, Math.ceil(6 / shown.length)) }, () => shown).flat();

  return (
    <section aria-labelledby="certificates-title" className="py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="certificates-title" className="border-t border-line pt-10 font-serif text-[1.9rem] leading-none italic">
          Gallery
        </h2>
      </div>

      <div className="cert-strip mt-8 overflow-hidden">
        <ul className="cert-track flex w-max gap-5 px-5 sm:px-8">
          {lap.map((c, i) => (
            <CertificatePhoto key={`a-${i}`} certificate={c} copy={i >= shown.length} />
          ))}
          {lap.map((c, i) => (
            <CertificatePhoto key={`b-${i}`} certificate={c} copy />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CertificatePhoto({ certificate: c, copy }: { certificate: Certificate; copy: boolean }) {
  return (
    // Every card is the same height; its width follows the photo, so nothing is cropped.
    <li
      aria-hidden={copy || undefined}
      style={{ aspectRatio: `${c.width ?? 4} / ${c.height ?? 3}` }}
      className="h-[10.2rem] shrink-0 sm:h-[12.75rem]"
    >
      <a
        href={`/certificates/${c.image}`}
        target="_blank"
        rel="noreferrer"
        tabIndex={copy ? -1 : undefined}
        data-cursor="View"
        className="relative block size-full overflow-hidden rounded-2xl border border-line bg-card transition-transform hover:-translate-y-1"
      >
        <Image src={`/certificates/${c.image}`} alt={`${c.title}: ${c.note}`} fill sizes="(min-width: 640px) 19rem, 14rem" className="object-cover" />
      </a>
    </li>
  );
}

import Image from "next/image";
import { certificates, type Certificate } from "@/data/certificates";

// A strip of certificate photos that keeps drifting sideways on its own. Only certificates
// with an image are shown; until there is at least one, the section stays hidden.
export function Certificates() {
  const shown = certificates.filter((c) => c.image);
  if (shown.length === 0) return null;
  // Repeat short lists so one lap is wider than the screen, then render the lap twice so
  // the loop is seamless (the second copy is hidden from assistive tech).
  const lap = Array.from({ length: Math.max(1, Math.ceil(8 / shown.length)) }, () => shown).flat();

  return (
    <section aria-labelledby="certificates-title" className="py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="certificates-title" className="flex items-baseline gap-4 border-t border-line pt-10">
          <span className="label">Proof</span>
          <span className="font-serif text-[1.9rem] leading-none italic">Certificates</span>
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
    <li aria-hidden={copy || undefined} className="w-[17rem] shrink-0 sm:w-[20rem]">
      <a
        href={`/certificates/${c.image}`}
        target="_blank"
        rel="noreferrer"
        tabIndex={copy ? -1 : undefined}
        data-cursor="View"
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-card transition-transform hover:-translate-y-1"
      >
        <Image src={`/certificates/${c.image}`} alt={`${c.title} certificate`} fill sizes="20rem" className="object-cover" />
      </a>
    </li>
  );
}

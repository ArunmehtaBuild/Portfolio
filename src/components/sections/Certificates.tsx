import Image from "next/image";
import { certificates, type Certificate } from "@/data/certificates";

// A small strip of certificates that drifts sideways on its own. It pauses while you hover
// or tab into it; with reduced motion it becomes a plain swipeable row.
export function Certificates() {
  if (certificates.length === 0) return null;
  return (
    <section aria-labelledby="certificates-title" className="py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="certificates-title" className="flex items-baseline gap-4 border-t border-line pt-10">
          <span className="label">Proof</span>
          <span className="font-serif text-[1.9rem] leading-none italic">Certificates</span>
        </h2>
      </div>

      <div className="cert-strip mt-8 overflow-x-auto [scrollbar-width:none]">
        <ul className="cert-track flex w-max gap-5 px-5 sm:px-8">
          {certificates.map((c) => (
            <CertificateCard key={c.title} certificate={c} />
          ))}
          {/* A second copy makes the loop seamless; it is hidden from assistive tech. */}
          {certificates.map((c) => (
            <CertificateCard key={`${c.title}-copy`} certificate={c} copy />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CertificateCard({ certificate: c, copy = false }: { certificate: Certificate; copy?: boolean }) {
  const body = c.image ? (
    <Image src={`/certificates/${c.image}`} alt={`${c.title} certificate`} fill sizes="20rem" className="object-cover" />
  ) : (
    // Placeholder until the image is added: a framed card in the page's gold.
    <div className="absolute inset-3 flex flex-col justify-between rounded-xl border border-accent/40 p-5">
      <span className="label">Certificate</span>
      <div>
        <p className="font-serif text-[1.55rem] leading-[1.05]">{c.title}</p>
        <p className="mt-2 font-mono text-[0.72rem] tracking-[0.12em] text-accent uppercase">{c.note}</p>
      </div>
    </div>
  );

  return (
    <li aria-hidden={copy || undefined} className="w-[17rem] shrink-0 sm:w-[20rem]">
      {c.image ? (
        <a
          href={`/certificates/${c.image}`}
          target="_blank"
          rel="noreferrer"
          tabIndex={copy ? -1 : undefined}
          data-cursor="View"
          className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-card transition-transform hover:-translate-y-1"
        >
          {body}
        </a>
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-card">{body}</div>
      )}
      {c.image && (
        <p className="mt-3 flex justify-between gap-3 text-[0.85rem]">
          <span className="font-medium">{c.title}</span>
          <span className="text-muted">{c.note}</span>
        </p>
      )}
    </li>
  );
}

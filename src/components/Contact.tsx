import { offTheMap, profile } from "@/data/profile";

export function Contact() {
  const links = [
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: "github.com/ArunmehtaBuild", href: profile.links[0].href },
    { label: "linkedin.com/in/arunmehtaa", href: profile.links[1].href },
    ...(profile.resumeHref ? [{ label: "Résumé (PDF)", href: profile.resumeHref }] : []),
  ];

  return (
    <>
      <section aria-labelledby="off-title" className="border-t border-line pt-14 pb-16 sm:pt-20">
        <p className="label">Off the map</p>
        <h2 id="off-title" className="sr-only">
          Off the map
        </h2>
        <dl className="mt-6 grid gap-8 sm:grid-cols-2">
          {offTheMap.map((item) => (
            <div key={item.heading}>
              <dt className="text-[1.4rem] font-medium">{item.heading}</dt>
              <dd className="mt-2 text-[1.08rem] leading-[1.65] text-muted">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" data-stop="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t border-line pt-14 pb-24 sm:pt-20">
        <p className="label">Region 09 · Contact</p>
        <h2 id="contact-title" className="mt-4 text-[2rem] leading-[1.1] font-medium sm:text-[2.6rem]">
          Open to internships, collaborations and hard problems.
        </h2>
        <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center gap-2 font-mono text-[0.95rem] text-sea underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

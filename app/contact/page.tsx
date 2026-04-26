import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Studio Noir",
  description: "Start a project."
};

export default function ContactPage() {
  return (
    <div className="container-px mx-auto max-w-7xl pb-32 pt-40 md:pb-40 md:pt-48">
      <section className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
          Contact
        </p>
        <div className="md:col-span-9">
          <h1 className="font-display text-5xl leading-[0.95] tracking-tightest text-balance md:text-7xl">
            Let&apos;s talk about your
            <span className="italic text-accent-muted"> next cut.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-accent-muted">
            Currently booking projects for Q3 and Q4. Send a brief and any
            references — I&apos;ll respond within two working days.
          </p>
        </div>
      </section>

      <section className="mt-24 grid grid-cols-1 gap-16 border-t border-white/5 pt-16 md:mt-32 md:grid-cols-12 md:pt-24">
        <aside className="md:col-span-4">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                Email
              </p>
              <a
                href="mailto:hello@studionoir.co"
                className="font-display mt-3 block text-2xl tracking-tightest underline-grow"
              >
                hello@studionoir.co
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                Studio
              </p>
              <p className="mt-3 text-base text-accent-muted">
                Lisbon, Portugal
                <br />
                Available worldwide · Remote-first
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                Hours
              </p>
              <p className="mt-3 text-base text-accent-muted">
                Mon — Fri, 09:00 — 19:00 WET
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-2 text-base">
                <li>
                  <a className="underline-grow" href="https://vimeo.com">
                    Vimeo
                  </a>
                </li>
                <li>
                  <a className="underline-grow" href="https://instagram.com">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="md:col-span-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

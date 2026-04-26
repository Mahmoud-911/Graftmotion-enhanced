import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-px mx-auto max-w-7xl py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-display text-3xl tracking-tightest md:text-4xl">
              Let&apos;s make
              <br />
              <span className="italic text-accent-muted">something cinematic.</span>
            </h3>
            <Link
              href="/contact"
              className="mt-6 inline-block text-sm uppercase tracking-[0.25em] underline-grow"
            >
              Start a project →
            </Link>
          </div>

          <div className="md:col-start-3">
            <p className="text-xs uppercase tracking-[0.25em] text-accent-muted">
              Connect
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="underline-grow" href="mailto:hello@studionoir.co">
                  hello@studionoir.co
                </a>
              </li>
              <li>
                <a
                  className="underline-grow"
                  href="https://vimeo.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Vimeo
                </a>
              </li>
              <li>
                <a
                  className="underline-grow"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="underline-grow"
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs uppercase tracking-[0.25em] text-accent-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Studio Noir</span>
          <span>Crafted in the dark — Edited with intent.</span>
        </div>
      </div>
    </footer>
  );
}

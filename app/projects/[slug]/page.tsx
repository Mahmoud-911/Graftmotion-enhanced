import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return { title: "Not found — Studio Noir" };
  return {
    title: `${project.title} — Studio Noir`,
    description: project.description
  };
}

export default function ProjectDetail({
  params
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="pb-32 pt-32 md:pb-40 md:pt-40">
      {/* Title block */}
      <header className="container-px mx-auto max-w-7xl py-16 md:py-24">
        <Link
          href="/projects"
          className="text-xs uppercase tracking-[0.3em] text-accent-muted underline-grow"
        >
          ← All Work
        </Link>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.4em] text-accent-muted">
              {project.category} · {project.year}
            </p>
            <h1 className="animate-fade-up mt-6 font-display text-5xl leading-[0.95] tracking-tightest text-balance md:text-8xl">
              {project.title}
            </h1>
          </div>
          <aside className="md:col-span-4 md:pl-8">
            <dl className="grid grid-cols-2 gap-y-8 text-sm md:grid-cols-1">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                  Client
                </dt>
                <dd className="mt-2">{project.client}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                  Role
                </dt>
                <dd className="mt-2">{project.role.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                  Year
                </dt>
                <dd className="mt-2">{project.year}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      {/* Player */}
      <section className="container-px mx-auto max-w-7xl">
        <div className="animate-scale-in relative aspect-video w-full overflow-hidden rounded-sm bg-ink-900 ring-1 ring-white/5">
          <iframe
            src={project.embed}
            title={project.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </section>

      {/* Body */}
      <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.4em] text-accent-muted">
              Synopsis
            </p>
          </div>
          <div className="md:col-span-9">
            <p className="font-display text-2xl leading-snug tracking-tightest text-balance md:text-4xl">
              {project.description}
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-12 border-t border-white/5 pt-16 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
              Tools
            </p>
            <ul className="mt-4 space-y-2 text-base">
              {project.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
              Role
            </p>
            <ul className="mt-4 space-y-2 text-base">
              {project.role.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
              Credits
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-y-3">
              {project.credits.map((c) => (
                <div
                  key={c.label}
                  className="flex items-baseline justify-between border-b border-white/5 pb-3"
                >
                  <dt className="text-xs uppercase tracking-[0.25em] text-accent-muted">
                    {c.label}
                  </dt>
                  <dd className="text-sm">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Next */}
      <section className="border-t border-white/5">
        <Link
          href={`/projects/${next.slug}`}
          className="container-px group mx-auto flex max-w-7xl items-center justify-between py-20 md:py-32"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent-muted">
              Next Project
            </p>
            <h3 className="font-display mt-4 text-4xl tracking-tightest transition-transform duration-700 group-hover:translate-x-2 md:text-7xl">
              {next.title}
            </h3>
          </div>
          <span className="text-3xl transition-transform duration-700 group-hover:translate-x-2 md:text-5xl">
            →
          </span>
        </Link>
      </section>
    </article>
  );
}

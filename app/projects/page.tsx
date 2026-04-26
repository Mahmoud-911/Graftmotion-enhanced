import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Work — Studio Noir",
  description: "Selected films, commercials, and music videos."
};

export default function ProjectsIndex() {
  return (
    <section className="container-px mx-auto max-w-7xl pb-32 pt-40 md:pb-40 md:pt-48">
      {/* Header */}
      <div className="grid grid-cols-1 gap-12 border-b border-white/5 pb-16 md:grid-cols-12 md:pb-24">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
          Index — All Work
        </p>
        <div className="md:col-span-9">
          <h1 className="font-display text-5xl leading-[0.95] tracking-tightest text-balance md:text-7xl">
            Selected work,
            <br />
            <span className="italic text-accent-muted">2023 — 2025.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-accent-muted md:text-lg">
            A rolling archive of editorial, color, and motion design — feature
            films, brand work, music videos, and the occasional documentary.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-32">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className={`animate-fade-up ${i % 2 === 1 ? "md:mt-24" : ""}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <ProjectCard
              project={p}
              index={i}
              size={i % 3 === 0 ? "default" : i % 3 === 1 ? "tall" : "wide"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

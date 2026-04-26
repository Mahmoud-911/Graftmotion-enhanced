export const metadata = {
  title: "About — Studio Noir",
  description: "Bio, skills, and tools."
};

const skills = [
  {
    title: "Editorial",
    body: "Narrative pacing, rhythm, and continuity. Long-form documentary, brand films, music videos."
  },
  {
    title: "Color Grading",
    body: "Filmic, palette-driven grades in DaVinci Resolve. Shot matching, look design, deliverables."
  },
  {
    title: "Motion Design",
    body: "Kinetic typography, transitions, and 2D/3D motion graphics built for the cut, not bolted on."
  },
  {
    title: "Sound Design",
    body: "Foley layering, sound-led transitions, and tight collaboration with composers and mix engineers."
  }
];

const tools = [
  "Adobe Premiere Pro",
  "DaVinci Resolve",
  "Adobe After Effects",
  "Cinema 4D",
  "Pro Tools",
  "Frame.io"
];

const timeline = [
  { year: "2025", body: "Independent — Studio Noir, freelance editor & colorist." },
  { year: "2023", body: "Senior Editor at North&Co. Brand films and global campaigns." },
  { year: "2020", body: "Junior Editor at Foreground. Long-form documentary work." },
  { year: "2018", body: "BFA Film Production, with a focus on post-production." }
];

export default function AboutPage() {
  return (
    <div className="container-px mx-auto max-w-7xl pb-32 pt-40 md:pb-40 md:pt-48">
      {/* Hero */}
      <section className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
          About
        </p>
        <div className="md:col-span-9">
          <h1 className="font-display text-5xl leading-[0.95] tracking-tightest text-balance md:text-7xl">
            I&apos;m a video editor and colorist building
            <span className="italic text-accent-muted"> quiet, cinematic </span>
            stories.
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-accent-muted">
            {/* REPLACE: bio */}
            Eight years cutting for brands, musicians, and independent
            filmmakers. I work best when I can sit with footage long enough to
            hear what it&apos;s asking for — then trust the cut to do the rest.
            Based in Lisbon, available worldwide and fully remote.
          </p>
        </div>
      </section>

      {/* Portrait + caption */}
      <section className="mt-24 grid grid-cols-1 gap-10 md:mt-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink-800">
            {/* REPLACE: replace with your portrait */}
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1600&q=80"
              alt="Editor at work"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="self-end md:col-span-5">
          <p className="font-display text-2xl italic leading-snug tracking-tightest md:text-3xl">
            “Edit like an audience member. Finish like a craftsman.”
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-32 border-t border-white/5 pt-16 md:mt-40 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
            Skills
          </p>
          <div className="grid grid-cols-1 gap-12 md:col-span-9 md:grid-cols-2">
            {skills.map((s) => (
              <div key={s.title}>
                <h3 className="font-display text-3xl tracking-tightest md:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-accent-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="mt-32 border-t border-white/5 pt-16 md:mt-40 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
            Tools
          </p>
          <ul className="md:col-span-9">
            {tools.map((tool, i) => (
              <li
                key={tool}
                className={`group flex items-center justify-between border-b border-white/5 py-6 transition-colors hover:bg-white/[0.02] md:py-8`}
              >
                <span className="font-display text-3xl tracking-tightest md:text-5xl">
                  {tool}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent-muted">
                  {String(i + 1).padStart(2, "0")} / {tools.length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-32 border-t border-white/5 pt-16 md:mt-40 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-muted md:col-span-3">
            Timeline
          </p>
          <ul className="md:col-span-9">
            {timeline.map((t) => (
              <li
                key={t.year}
                className="grid grid-cols-[80px_1fr] items-baseline gap-6 border-b border-white/5 py-6 md:grid-cols-[120px_1fr]"
              >
                <span className="font-display text-2xl tracking-tightest md:text-3xl">
                  {t.year}
                </span>
                <span className="text-base text-accent-muted">{t.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

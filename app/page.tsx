import WorkItem from "@/components/WorkItem";
import FloatingIcons from "@/components/FloatingIcons";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SiteContent = {
  site: {
    title: string;
    subtitle: string;
    email: string;
    ctaText: string;
    ctaUrl: string;
  };
  hero: { videoUrl: string };
  clients: Array<{ id: string; name: string; logo: string }>;
  featuredWork: Array<{
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
  }>;
  testimonials: {
    featuredImage: string;
    items: Array<{
      id: string;
      clientName: string;
      role: string;
      image: string;
      quote: string;
    }>;
  };
  moreWork: Array<{
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
  }>;
};

// Normalise a work item so WorkItem component always gets camelCase fields,
// regardless of whether the stored data used snake_case or camelCase.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseWorkItem(v: any) {
  return {
    ...v,
    videoUrl:  v.videoUrl  || v.video_url  || "",
    thumbnail: v.thumbnail || v.thumbnail_url || "",
  };
}

async function getContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("id", "main")
      .single();

    if (error || !data?.data) throw new Error("no content");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = data.data as any;

    return {
      ...c,
      featuredWork: (c.featuredWork || []).map(normaliseWorkItem),
      moreWork:     (c.moreWork     || []).map(normaliseWorkItem),
    };
  } catch {
    return {
      site: {
        title: "GRAFTMOTION",
        subtitle: "Reliable Direction-aligned Videos. Guaranteed.",
        email: "graftmotionfx@gmail.com",
        ctaText: "Work With ME",
        ctaUrl: "https://www.instagram.com/graftmotion.vfx/"
      },
      hero: { videoUrl: "" },
      clients: [],
      featuredWork: [],
      testimonials: { featuredImage: "", items: [] },
      moreWork: []
    };
  }
}

/** Wraps `word` in an orange glow span within `text`. Falls back to plain text. */
function Accent({ text, word }: { text: string; word: string }) {
  const idx = text.indexOf(word);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent-glow">{word}</span>
      {text.slice(idx + word.length)}
    </>
  );
}

export default async function HomePage() {
  const c = await getContent();
  const site         = c.site         ?? ({} as SiteContent["site"]);
  const hero         = c.hero         ?? ({} as SiteContent["hero"]);
  const clients      = c.clients      ?? [];
  const featuredWork = c.featuredWork ?? [];
  const testimonials = c.testimonials ?? ({ featuredImage: "", items: [] } as SiteContent["testimonials"]);
  const moreWork     = c.moreWork     ?? [];

  // Determine which suffix of the brand title to highlight (e.g. "MOTION")
  const motionWord = site?.title?.includes("MOTION") ? "MOTION" : "";

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        <FloatingIcons />
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-12 pt-28 text-center">
        <h1
          className="font-display text-7xl md:text-9xl"
          style={{ color: "var(--text)", letterSpacing: "0.06em" }}
        >
          {motionWord
            ? <Accent text={site?.title || ""} word={motionWord} />
            : site?.title || ""}
        </h1>
        <p
          className="mx-auto mt-3 max-w-lg text-base font-semibold md:text-lg"
          style={{ color: "var(--text-muted)" }}
        >
          <Accent text={site?.subtitle || ""} word="Guaranteed" />
        </p>

        {/* Showreel */}
        <div
          className="relative mt-8 w-full overflow-hidden rounded-2xl"
          style={{
            aspectRatio: "16/9",
            background: "var(--surface)",
            border: "1px solid var(--border)"
          }}
        >
          {hero?.videoUrl ? (
            <video
              src={hero?.videoUrl || ""}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Showreel — Upload from Admin
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <a href={site?.ctaUrl || ""} target="_blank" rel="noreferrer" className="btn-primary text-base">
            {site?.ctaText || ""}
          </a>
        </div>
      </section>
      </div>{/* end hero wrapper */}

      {/* ── CLIENTS ───────────────────────────────────────── */}
      {clients.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <p
            className="mb-8 text-center text-base italic"
            style={{ color: "var(--text-muted)" }}
          >
            Some clients I've worked with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {clients.map((cl) => (
              <div key={cl.id} className="flex items-center gap-3">
                <div
                  className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                  style={{
                    background: "var(--surface-2)",
                    border: "2px solid var(--border)"
                  }}
                >
                  {cl.logo && (
                    <img
                      src={cl.logo}
                      alt={cl.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {cl.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="divider" />
      </div>

      {/* ── MY WORK ───────────────────────────────────────── */}
      <section id="work" className="mx-auto max-w-5xl px-6 py-16">
        <p className="section-label mb-10 text-center">
          My <span className="text-accent-glow">Work</span>
        </p>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {featuredWork.slice(0, 4).map((item) => (
            <WorkItem key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={site?.ctaUrl || ""} target="_blank" rel="noreferrer" className="btn-secondary">
            {site?.ctaText || ""}
          </a>
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="divider" />
      </div>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2
          className="mb-10 text-center font-display text-4xl md:text-6xl"
          style={{ color: "var(--text)" }}
        >
          See What My Clients Are{" "}
          <span className="text-accent-glow">Saying</span>
        </h2>

        {/* Featured testimonial image */}
        <div
          className="w-full overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)"
          }}
        >
          {testimonials?.featuredImage ? (
            <img
              src={testimonials?.featuredImage || ""}
              alt="Client testimonials"
              className="w-full object-cover"
            />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ aspectRatio: "16/7" }}
            >
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Upload testimonials screenshot from Admin
              </p>
            </div>
          )}
        </div>

        {/* Individual testimonial cards */}
        {(testimonials?.items || []).filter((t) => t.quote || t.image).length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(testimonials?.items || [])
              .filter((t) => t.quote || t.image)
              .map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-4 rounded-xl p-6"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
                      style={{ background: "var(--surface-2)" }}
                    >
                      {t.image && (
                        <img
                          src={t.image}
                          alt={t.clientName}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        {t.clientName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                  {t.quote && (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ── MORE WORK ─────────────────────────────────────── */}
      {moreWork.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <p className="section-label mb-8 text-center">
          See More <span className="text-accent-glow">Work</span>
        </p>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {moreWork.map((item) => (
              <WorkItem key={item.id} item={item} small />
            ))}
          </div>
        </section>
      )}

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="divider" />
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p
          className="mb-2 text-sm font-medium italic"
          style={{ color: "var(--text-muted)" }}
        >
          Send Me A Message, My DMs Are Open!
        </p>
        <h2
          className="font-display text-5xl leading-tight md:text-8xl"
          style={{ color: "var(--text)" }}
        >
          LET'S WORK{" "}
          <span className="text-accent-glow">TOGETHER</span>
        </h2>
        <div className="mt-8">
          <a href={site?.ctaUrl || ""} target="_blank" rel="noreferrer" className="btn-secondary">
            {site?.ctaText || ""}
          </a>
        </div>
        <p className="mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Or Email Me
        </p>
        <a
          href={`mailto:${site?.email || ""}`}
          className="mt-1 inline-block text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          {site?.email || ""}
        </a>
      </section>
    </div>
  );
}

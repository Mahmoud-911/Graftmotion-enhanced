"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1518930259200-3e5b73d3fb1f?auto=format&fit=crop&w=2400&q=80"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/*
          REPLACE: drop your own showreel here.
          Use a 1080p MP4, ideally < 8 MB, looping, muted by default.
        */}
        <source
          src="https://cdn.coverr.co/videos/coverr-cinematic-aerial-of-a-foggy-forest-7568/1080p.mp4"
          type="video/mp4"
        />
      </video>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-ink-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950" />

      {/* Letterbox bars */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-ink-950" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-ink-950" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-px mx-auto w-full max-w-7xl">
          <p className="animate-fade-in text-xs uppercase tracking-[0.4em] text-accent-muted">
            Reel · 2024 / 2025
          </p>
          <h1 className="animate-fade-up mt-6 font-display text-[14vw] leading-[0.95] tracking-tightest text-balance md:text-[8.5vw]">
            Video Editor
            <br />
            <span className="italic text-accent-muted">Portfolio.</span>
          </h1>

          <p
            className="animate-fade-up mt-8 max-w-xl text-base leading-relaxed text-accent-muted md:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            Cinematic editing, color, and motion design for brands, musicians,
            and filmmakers. Story first — every frame earned.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm uppercase tracking-[0.25em] text-ink-950 transition-transform duration-500 hover:scale-[1.02]"
            >
              View the Reel
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-[0.25em] underline-grow"
            >
              Book a project
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-[10vh] left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-accent-muted">
          Scroll
          <span className="h-10 w-px animate-pulse bg-accent-muted" />
        </div>
      </div>
    </section>
  );
}

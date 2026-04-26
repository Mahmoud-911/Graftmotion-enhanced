"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  index?: number;
  size?: "default" | "wide" | "tall";
};

export default function ProjectCard({ project, index = 0, size = "default" }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const onLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const aspect =
    size === "wide"
      ? "aspect-[16/9]"
      : size === "tall"
      ? "aspect-[3/4]"
      : "aspect-[4/5]";

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-sm bg-ink-800 ${aspect}`}
      >
        {/* Poster */}
        <img
          src={project.thumbnail}
          alt={project.title}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out ${
            hovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {/* Hover preview */}
        <video
          ref={videoRef}
          src={project.preview}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />

        {/* Index */}
        <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.3em] text-accent-muted">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Play badge */}
        <span
          className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-transform duration-500 ${
            hovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 fill-accent"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent-muted">
            {project.category} · {project.year}
          </p>
          <h3 className="font-display mt-1 text-2xl tracking-tightest md:text-3xl">
            {project.title}
          </h3>
        </div>
        <span className="hidden text-xs uppercase tracking-[0.25em] text-accent-muted md:block">
          {project.client}
        </span>
      </div>
    </Link>
  );
}

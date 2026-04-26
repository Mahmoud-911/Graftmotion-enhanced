"use client";

import { useEffect } from "react";

function getEmbedUrl(url: string): { type: "iframe" | "video"; src: string } {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    };
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    };
  }
  // Local / direct MP4
  return { type: "video", src: url };
}

type Props = {
  videoUrl: string;
  title?: string;
  onClose: () => void;
};

export default function VideoModal({ videoUrl, title, onClose }: Props) {
  const embed = getEmbedUrl(videoUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-5xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          aria-label="Close video"
        >
          ✕
        </button>

        {title && (
          <p className="mb-3 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
        )}

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {embed.type === "iframe" ? (
            <iframe
              src={embed.src}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={embed.src}
              autoPlay
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

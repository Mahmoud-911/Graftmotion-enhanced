"use client";

import { useState } from "react";
import VideoModal from "./VideoModal";

type WorkItemData = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
};

export default function WorkItem({
  item,
  small = false
}: {
  item: WorkItemData;
  small?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasVideo = !!item.videoUrl;
  const hasThumbnail = !!item.thumbnail;

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-xl"
        onClick={() => hasVideo && setOpen(true)}
        style={{
          aspectRatio: "16/9",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          cursor: hasVideo ? "pointer" : "default",
          transition: "border-color 0.3s ease, transform 0.3s ease"
        }}
        onMouseEnter={(e) => {
          if (hasVideo) e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {/* Thumbnail */}
        {hasThumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Dark gradient when no thumbnail but has video */}
        {!hasThumbnail && hasVideo && (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1c0a00 0%, #0d0d0d 100%)"
            }}
          />
        )}

        {/* Hover dim overlay on thumbnail */}
        {hasThumbnail && hasVideo && (
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "rgba(0,0,0,0.45)" }}
          />
        )}

        {/* Play button — always visible when hasVideo */}
        {hasVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
              style={{
                width: small ? "38px" : "56px",
                height: small ? "38px" : "56px",
                background: "var(--accent)",
                boxShadow: "0 0 28px rgba(255,102,0,0.45)"
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: small ? "14px" : "20px",
                  height: small ? "14px" : "20px",
                  fill: "#fff",
                  marginLeft: "2px"
                }}
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {!small && item.title && (
              <span
                className="max-w-[80%] truncate text-center text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {item.title}
              </span>
            )}
          </div>
        )}

        {/* No media placeholder */}
        {!hasThumbnail && !hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {small ? "Upload" : "Upload from Admin"}
            </span>
          </div>
        )}
      </div>

      {open && (
        <VideoModal
          videoUrl={item.videoUrl}
          title={item.title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

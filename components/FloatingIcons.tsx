"use client";

const ICONS = [
  { emoji: "🎬", label: "Clapper",     anim: "float-a", dur: 5.2, delay: 0,   rot: -9  },
  { emoji: "✂️", label: "Razor",       anim: "float-b", dur: 4.8, delay: 1.3, rot: 14  },
  { emoji: "🎞️", label: "Film strip",  anim: "float-c", dur: 5.8, delay: 0.7, rot: -6  },
  { emoji: "🎨", label: "Color grade", anim: "float-a", dur: 6.0, delay: 1.9, rot: 9   },
  { emoji: "▶️", label: "Play",        anim: "float-b", dur: 4.4, delay: 0.4, rot: 0   },
  { emoji: "🔊", label: "Audio",       anim: "float-c", dur: 5.5, delay: 2.2, rot: -11 },
  { emoji: "⏱️", label: "Timing",      anim: "float-a", dur: 5.0, delay: 1.6, rot: 7   },
  { emoji: "🎥", label: "Camera",      anim: "float-b", dur: 6.2, delay: 0.2, rot: -4  },
  { emoji: "⚡", label: "Effects",     anim: "float-c", dur: 4.6, delay: 1.1, rot: 16  },
  { emoji: "◆",  label: "Keyframe",    anim: "float-a", dur: 5.6, delay: 2.6, rot: 45  },
  { emoji: "🖥️", label: "Monitor",    anim: "float-b", dur: 5.3, delay: 0.6, rot: 0   },
  { emoji: "🎵", label: "Soundtrack",  anim: "float-c", dur: 4.9, delay: 1.8, rot: -7  },
];

export default function FloatingIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none w-full px-4 py-6"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {ICONS.map((icon, i) => (
          <div
            key={icon.label}
            className="flex items-center justify-center"
            style={{
              animation: "icon-fade-in 0.7s ease both",
              animationDelay: `${0.06 * i + 0.1}s`,
            }}
          >
            <div
              title={icon.label}
              className="flex items-center justify-center rounded-2xl text-3xl sm:text-4xl"
              style={{
                width: "56px",
                height: "56px",
                transform: `rotate(${icon.rot}deg)`,
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.13)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
                animation: `${icon.anim} ${icon.dur}s ease-in-out infinite`,
                animationDelay: `${icon.delay}s`,
                userSelect: "none",
              }}
            >
              {icon.emoji}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

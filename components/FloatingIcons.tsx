"use client";

const ICONS = [
  { emoji: "🎬", label: "Clapper",     x: 6,  y: 14, size: 60, anim: "float-a", dur: 5.2, delay: 0,   rot: -9  },
  { emoji: "✂️", label: "Razor",       x: 83, y: 10, size: 52, anim: "float-b", dur: 4.8, delay: 1.3, rot: 14  },
  { emoji: "🎞️", label: "Film strip",  x: 9,  y: 56, size: 56, anim: "float-c", dur: 5.8, delay: 0.7, rot: -6  },
  { emoji: "🎨", label: "Color grade", x: 79, y: 60, size: 60, anim: "float-a", dur: 6.0, delay: 1.9, rot: 9   },
  { emoji: "▶️", label: "Play",        x: 2,  y: 37, size: 48, anim: "float-b", dur: 4.4, delay: 0.4, rot: 0   },
  { emoji: "🔊", label: "Audio",       x: 89, y: 36, size: 52, anim: "float-c", dur: 5.5, delay: 2.2, rot: -11 },
  { emoji: "⏱️", label: "Timing",      x: 69, y: 20, size: 48, anim: "float-a", dur: 5.0, delay: 1.6, rot: 7   },
  { emoji: "🎥", label: "Camera",      x: 19, y: 77, size: 64, anim: "float-b", dur: 6.2, delay: 0.2, rot: -4  },
  { emoji: "⚡", label: "Effects",     x: 88, y: 76, size: 44, anim: "float-c", dur: 4.6, delay: 1.1, rot: 16  },
  { emoji: "◆",  label: "Keyframe",    x: 47, y: 7,  size: 40, anim: "float-a", dur: 5.6, delay: 2.6, rot: 45  },
  { emoji: "🖥️", label: "Monitor",    x: 43, y: 82, size: 56, anim: "float-b", dur: 5.3, delay: 0.6, rot: 0   },
  { emoji: "🎵", label: "Soundtrack",  x: 62, y: 72, size: 48, anim: "float-c", dur: 4.9, delay: 1.8, rot: -7  },
];

export default function FloatingIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ICONS.map((icon, i) => (
        <div
          key={icon.label}
          style={{
            position: "absolute",
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: `rotate(${icon.rot}deg)`,
            animation: "icon-fade-in 0.7s ease both",
            animationDelay: `${0.06 * i + 0.1}s`,
          }}
        >
          <div
            title={icon.label}
            style={{
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              fontSize: `${Math.round(icon.size * 0.44)}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
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
  );
}

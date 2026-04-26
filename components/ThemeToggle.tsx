"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("gm-theme") as "dark" | "light") || "dark";
    setTheme(saved);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("gm-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex h-9 w-16 items-center rounded-full border p-1 transition-all duration-300"
      style={{
        background: theme === "dark" ? "var(--surface-2)" : "var(--surface)",
        borderColor: "var(--border)"
      }}
    >
      {/* Track icons */}
      <span className="absolute left-2 text-xs">🌙</span>
      <span className="absolute right-2 text-xs">☀️</span>
      {/* Thumb */}
      <span
        className="relative z-10 h-6 w-6 rounded-full shadow transition-transform duration-300"
        style={{
          background: "var(--accent)",
          transform: theme === "light" ? "translateX(28px)" : "translateX(0)"
        }}
      />
    </button>
  );
}

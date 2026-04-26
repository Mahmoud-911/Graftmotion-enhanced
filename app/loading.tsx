export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="space-y-4 text-center">
        <p
          className="font-display text-5xl"
          style={{ color: "var(--accent)" }}
        >
          GM
        </p>
        <div
          className="relative h-px w-48 overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <div
            className="absolute inset-0 animate-[loaderSlide_1.4s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(90deg,transparent,var(--accent),transparent)"
            }}
          />
        </div>
      </div>
    </div>
  );
}

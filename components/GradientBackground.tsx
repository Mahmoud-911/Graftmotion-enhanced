"use client";

export default function GradientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* Large orange orb — top-left anchor */}
      <div
        style={{
          position: "absolute",
          width: "950px",
          height: "950px",
          top: "-320px",
          left: "-220px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,102,0,0.22) 0%, rgba(255,60,0,0.06) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift-1 18s ease-in-out infinite",
        }}
      />

      {/* Deep purple orb — bottom-right counter-drift */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          bottom: "-240px",
          right: "-190px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(100,0,220,0.17) 0%, rgba(60,0,180,0.05) 50%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orb-drift-2 22s ease-in-out infinite",
        }}
      />

      {/* Mid amber orb — roams center-right */}
      <div
        style={{
          position: "absolute",
          width: "580px",
          height: "580px",
          top: "32%",
          right: "12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,50,0,0.13) 0%, transparent 68%)",
          filter: "blur(75px)",
          animation: "orb-drift-3 28s ease-in-out infinite",
        }}
      />

      {/* Small warm orb — lower-left, reversed phase */}
      <div
        style={{
          position: "absolute",
          width: "440px",
          height: "440px",
          bottom: "18%",
          left: "6%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.11) 0%, transparent 65%)",
          filter: "blur(62px)",
          animation: "orb-drift-1 24s ease-in-out infinite reverse",
          animationDelay: "-11s",
        }}
      />

      {/* Accent streak — top-right highlight */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          top: "8%",
          right: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,102,0,0.09) 0%, transparent 60%)",
          filter: "blur(50px)",
          animation: "orb-drift-2 15s ease-in-out infinite",
          animationDelay: "-6s",
        }}
      />
    </div>
  );
}

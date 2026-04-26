import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 text-center"
      style={{ background: "var(--bg)" }}
    >
      <p className="font-display text-8xl" style={{ color: "var(--accent)" }}>
        404
      </p>
      <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>
        Page not found.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

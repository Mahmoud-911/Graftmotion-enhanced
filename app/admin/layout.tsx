import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — GRAFTMOTION",
  robots: { index: false, follow: false }
};

// Nested layout — no <html>/<body> here, those come from app/layout.tsx
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GradientBackground from "@/components/GradientBackground";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "GRAFTMOTION — Video Portfolio",
  description: "Reliable Direction-aligned Videos. Guaranteed.",
  // app/icon.png, app/apple-icon.png and app/favicon.ico are auto-detected
  // by Next.js App Router — no explicit icons config needed for those.
  // Extra sizes served from /public for Android / PWA manifests:
  icons: {
    icon: [
      { url: "/icon-32.png",  sizes: "32x32",  type: "image/png" },
      { url: "/icon-16.png",  sizes: "16x16",  type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('gm-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})()`
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GradientBackground />
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

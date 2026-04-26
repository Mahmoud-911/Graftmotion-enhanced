import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GradientBackground from "@/components/GradientBackground";

export const metadata: Metadata = {
  title: "GRAFTMOTION — Video Portfolio",
  description: "Reliable Direction-aligned Videos. Guaranteed."
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
      </body>
    </html>
  );
}

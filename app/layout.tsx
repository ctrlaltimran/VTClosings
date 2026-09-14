import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/venture/providers";

export const metadata: Metadata = {
  title: "Venture Title Agency | Good Things Start With Home",
  description: "Michigan title insurance, escrow, and closing services. Venture Title Agency brings clarity and care to every step of your real estate transaction.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}

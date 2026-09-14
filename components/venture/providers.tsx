"use client";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import Lenis from "lenis";
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.05, anchors: true });
    return () => lenis.destroy();
  }, []);
  return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>{children}</ThemeProvider>;
}

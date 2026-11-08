"use client";

import { useEffect, useRef, useState } from "react";
import type { Figure } from "@lucasmarkes/hairline";

type FigureName = keyof typeof import("@lucasmarkes/hairline");

/** Web/client-only. Supply the surrounding theme's --hairline-* colors. */
export function HairlineFigure({ name, label, intensity = 0.35, theme = "auto", play = false, className }: {
  name: FigureName; label: string; intensity?: number;
  theme?: "auto" | "light" | "dark"; play?: boolean; className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let loading = false;
    let visible = false;
    let figure: Figure | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => figure?.update({ play: play && visible && !document.hidden && !motion.matches });
    const load = async () => {
      if (loading || figure) return;
      loading = true;
      setError(false);
      try {
        const library = await import("@lucasmarkes/hairline");
        if (disposed) return;
        figure = library[name](element, { label, intensity, theme, play: false });
        sync();
      } catch (cause) {
        if (!disposed) { console.error("Hairline failed to load", cause); setError(true); }
      }
    };
    const nearby = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { void load(); nearby.disconnect(); }
    }, { rootMargin: "180px" });
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15; sync();
    }, { threshold: [0, 0.15] });
    nearby.observe(element); viewport.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      disposed = true;
      nearby.disconnect(); viewport.disconnect(); figure?.destroy();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [name, label, intensity, theme, play]);
  return <div className={className} style={{ width: "100%", minWidth: 0 }}>
    <div ref={host} style={{ width: "100%", aspectRatio: "5 / 4" }} />
    {error && <p role="alert">Animation failed to load. Please reload.</p>}
  </div>;
}

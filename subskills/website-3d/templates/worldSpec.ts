/**
 * Copy this into a Website 3D feature, then replace example values with
 * approved world-bible decisions. Keep scene state data-driven so a second
 * world can reuse the runtime without duplicating it.
 */

export type Vec3 = readonly [number, number, number];

export type ChapterSpec = {
  id: string;
  scrollWeight: number;
  copy: {
    eyebrow: string;
    title: string;
    body: string;
    cta?: { label: string; href: string };
  };
  camera: {
    position: Vec3;
    target: Vec3;
    fov: number;
    mobile?: { position: Vec3; target: Vec3; fov: number };
  };
  world: {
    key: number;
    practicals: number;
    fog: number;
    particles: number;
    grade: "cold" | "neutral" | "warm";
  };
  focus: readonly string[];
  interactions: readonly string[];
  assets: readonly string[];
  fallback: string;
};

export const worldSpec = {
  id: "classroom-after-rain",
  units: "meters",
  quality: {
    mobile: { dpr: 1.35, shadows: 1024, particles: 0.45, post: "lite" },
    desktop: { dpr: 1.75, shadows: 2048, particles: 1, post: "full" }
  },
  chapters: [
    {
      id: "corridor",
      scrollWeight: 1.2,
      copy: {
        eyebrow: "01 / Arrival",
        title: "Rain holds the corridor quiet.",
        body: "The first view establishes scale, weather, and the next threshold."
      },
      camera: {
        position: [0, 1.6, 8],
        target: [0, 1.6, -8],
        fov: 40,
        mobile: { position: [0, 2.1, 10.5], target: [0, 1.7, -8], fov: 48 }
      },
      world: { key: 0.8, practicals: 0.1, fog: 0.012, particles: 0.25, grade: "cold" },
      focus: ["corridor-window"],
      interactions: [],
      assets: ["critical-shell", "rain"],
      fallback: "corridor-still"
    }
  ] satisfies readonly ChapterSpec[]
} as const;

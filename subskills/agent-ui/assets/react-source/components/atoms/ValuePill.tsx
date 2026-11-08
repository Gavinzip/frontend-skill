"use client";

import type { ReactNode } from "react";

type Tone = "default" | "green" | "orange" | "red";

const toneClasses: Record<Tone, string> = {
  default: "bg-field text-ink-2",
  green: "bg-green-tint text-green",
  orange: "bg-orange-tint text-orange",
  red: "bg-red-tint text-red",
};

export function ValuePill({ children, tone = "default" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-[5px] px-1.5 py-0.5 font-mono text-[0.86em] ${toneClasses[tone]}`}>{children}</span>;
}

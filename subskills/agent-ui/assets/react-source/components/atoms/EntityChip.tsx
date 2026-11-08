"use client";

import type { ReactNode } from "react";

export function EntityChip({ children, name }: { children?: ReactNode; name?: string }) {
  return (
    <span className="inline-flex items-center rounded-[5px] bg-accent-tint px-1.5 py-0.5 font-medium text-accent">
      {children ?? name}
    </span>
  );
}

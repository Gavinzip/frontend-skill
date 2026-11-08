"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Rect = Pick<CSSProperties, "height" | "transform" | "width">;

export default function GlideMenu({
  children,
  className = "",
  highlightClassName = "inset-x-0 rounded-[6px] bg-hover",
  rowSelector = "[data-menu-row], button, [role=menuitem], label",
}: {
  children: ReactNode;
  className?: string;
  highlightClassName?: string;
  rowSelector?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  const moveHighlight = useCallback(
    (target: EventTarget | null) => {
      const root = rootRef.current;
      if (!(target instanceof Element) || !root) return;
      const row = target.closest(rowSelector);
      if (!row || !root.contains(row)) return;
      const rootBox = root.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      setRect({
        height: `${rowBox.height}px`,
        transform: `translate(${rowBox.left - rootBox.left}px, ${rowBox.top - rootBox.top}px)`,
        width: `${rowBox.width}px`,
      });
    },
    [rowSelector],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => setRect(null));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative isolate ${className}`}
      onPointerLeave={() => setRect(null)}
      onPointerMove={(event) => moveHighlight(event.target)}
    >
      {rect && (
        <span
          aria-hidden
          className={`pointer-events-none absolute z-0 transition-[transform,width,height,opacity] duration-150 ease-out ${highlightClassName}`}
          style={rect}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

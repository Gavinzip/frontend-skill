"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "accent" | "secondary" | "ghost" | "quiet" | "success";
type ButtonSize = "xs" | "sm" | "md";

const variants: Record<ButtonVariant, string> = {
  accent: "bg-accent text-white hover:bg-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
  secondary: "bg-surface text-ink shadow-btn hover:bg-hover",
  ghost: "text-ink-2 hover:bg-hover hover:text-ink",
  quiet: "text-ink-3 hover:bg-hover hover:text-ink",
  success: "bg-green text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-[11.5px] rounded-[6px] gap-1",
  sm: "h-[27px] px-3 text-[13px] rounded-full gap-1.5",
  md: "h-9 px-3.5 text-[13px] rounded-control gap-1.5",
};

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium leading-none select-none transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

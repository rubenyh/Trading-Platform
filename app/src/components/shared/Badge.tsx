import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "default" | "success" | "danger" | "info" | "muted";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-[#2a2e39] text-slate-200",
  success: "bg-[rgba(38,166,154,0.2)] text-[#7fe3d8]",
  danger: "bg-[rgba(239,83,80,0.2)] text-[#ff9e9c]",
  info: "bg-[rgba(123,97,255,0.2)] text-[#b5a6ff]",
  muted: "bg-[rgba(154,163,178,0.2)] text-[#c2c9d6]",
};

export default function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase ${
        toneClasses[tone]
      }`}
    >
      {children}
    </span>
  );
}

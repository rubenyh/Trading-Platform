"use client";

import { useState, type ReactNode } from "react";

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({
  title,
  children,
  defaultOpen = true,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-[#2a2e39] bg-[#1e222d]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-200"
      >
        <span>{title}</span>
        <span className="text-slate-400">{open ? "-" : "+"}</span>
      </button>
      {open ? <div className="border-t border-[#2a2e39] px-4 py-3">{children}</div> : null}
    </section>
  );
}

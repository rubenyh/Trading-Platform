"use client";

import { useMemo, useState } from "react";
import { useChartStore } from "@/store/chartStore";

const SUGGESTIONS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
];

export default function TickerSearch() {
  const { ticker, setTicker } = useChartStore();
  const [query, setQuery] = useState(ticker);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) {
      return SUGGESTIONS;
    }

    return SUGGESTIONS.filter(
      (item) =>
        item.symbol.includes(trimmed) ||
        item.name.toUpperCase().includes(trimmed)
    );
  }, [query]);

  return (
    <div className="relative w-full max-w-65">
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        placeholder="Search ticker or company"
        className="w-full rounded-xl border border-[#2a2e39] bg-[#0f131b] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-[#7b61ff]"
      />
      {open ? (
        <div className="absolute top-11 z-30 w-full rounded-xl border border-[#2a2e39] bg-[#1e222d] shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          {filtered.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setTicker(item.symbol);
                setQuery(item.symbol);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-200 hover:bg-[#2a2e39]"
            >
              <span className="font-mono text-[#7b61ff]">{item.symbol}</span>
              <span className="text-xs text-slate-400">{item.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

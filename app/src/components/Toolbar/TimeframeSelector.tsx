"use client";

import { useChartStore } from "@/store/chartStore";
import type { Timeframe } from "@/types/market";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"];

export default function TimeframeSelector() {
  const { timeframe, setTimeframe } = useChartStore();

  return (
    <div className="flex flex-wrap gap-2">
      {TIMEFRAMES.map((frame) => (
        <button
          key={frame}
          type="button"
          onClick={() => setTimeframe(frame)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            timeframe === frame
              ? "border-[#7b61ff] bg-[#2a2242] text-[#b5a6ff]"
              : "border-[#2a2e39] text-slate-400 hover:border-[#7b61ff]/60"
          }`}
        >
          {frame}
        </button>
      ))}
    </div>
  );
}

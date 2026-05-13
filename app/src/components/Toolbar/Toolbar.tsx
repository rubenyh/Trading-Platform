"use client";

import { useEffect, useState } from "react";
import TickerSearch from "@/components/Toolbar/TickerSearch";
import TimeframeSelector from "@/components/Toolbar/TimeframeSelector";
import { useChartStore } from "@/store/chartStore";

interface ToolbarProps {
  onRunPrediction: () => void;
  predictionLoading: boolean;
}

export default function Toolbar({
  onRunPrediction,
  predictionLoading,
}: ToolbarProps) {
  const { chartType, setChartType } = useChartStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          "input[placeholder='Search ticker or company']"
        );
        input?.focus();
      }

      if (event.key.toLowerCase() === "r") {
        onRunPrediction();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRunPrediction]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2e39] bg-[#11141d]/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#26a69a] shadow-[0_0_12px_rgba(38,166,154,0.6)]" />
            <span className="text-xs uppercase tracking-[0.5em] text-slate-400">
              Market Sim
            </span>
          </div>
          <TickerSearch />
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
          <TimeframeSelector />

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-[#2a2e39] bg-[#0f131b] p-1">
              {([
                { type: "candlestick", label: "Candle" },
                { type: "line", label: "Line" },
                { type: "area", label: "Area" },
              ] as const).map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setChartType(item.type)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    chartType === item.type
                      ? "bg-[#2a2e39] text-slate-100"
                      : "text-slate-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onRunPrediction}
              className="inline-flex items-center gap-2 rounded-full border border-[#7b61ff] bg-[#2a2242] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#cbbfff] shadow-[0_0_16px_rgba(123,97,255,0.25)]"
            >
              {predictionLoading ? "Running" : "Run Prediction"}
              <span className="text-[10px] text-[#a995ff]">R</span>
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-[#2a2e39] bg-[#0f131b] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {settingsOpen ? (
        <div className="border-t border-[#2a2e39] bg-[#0f131b] px-6 py-4 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Chart Preferences</span>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-slate-400"
            >
              Close
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Theme, indicators, and scale controls will live here.
          </div>
        </div>
      ) : null}
    </header>
  );
}

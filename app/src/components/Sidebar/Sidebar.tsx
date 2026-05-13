"use client";

import { useEffect } from "react";
import type { Candle, PredictionResult } from "@/types/market";
import { useChartStore } from "@/store/chartStore";
import SymbolInfoPanel from "@/components/Sidebar/SymbolInfoPanel";
import OHLCVPanel from "@/components/Sidebar/OHLCVPanel";
import PredictionStatsPanel from "@/components/Sidebar/PredictionStatsPanel";
import IndicatorsPanel from "@/components/Sidebar/IndicatorsPanel";

interface SidebarProps {
  candles: Candle[];
  prediction: PredictionResult | null;
  loading: boolean;
}

export default function Sidebar({ candles, prediction, loading }: SidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useChartStore();

  useEffect(() => {
    const update = () => {
      setSidebarCollapsed(window.innerWidth < 1280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setSidebarCollapsed]);

  return (
    <aside
      className={`flex h-[calc(100vh-76px)] flex-col border-l border-[#2a2e39] bg-[#11141d] transition-[width] duration-300 ease ${
        sidebarCollapsed ? "w-16" : "w-70"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#2a2e39] px-4 py-3">
        <span
          className={`text-xs uppercase tracking-[0.4em] text-slate-400 ${
            sidebarCollapsed ? "opacity-0" : "opacity-100"
          } transition-opacity duration-200`}
        >
          Panels
        </span>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-xs uppercase tracking-[0.2em] text-slate-500"
        >
          {sidebarCollapsed ? ">" : "<"}
        </button>
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 ${
          sidebarCollapsed ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
      >
        <SymbolInfoPanel candles={candles} loading={loading} />
        <OHLCVPanel candles={candles} />
        <PredictionStatsPanel prediction={prediction} />
        <IndicatorsPanel />
      </div>
    </aside>
  );
}

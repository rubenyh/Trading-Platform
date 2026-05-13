"use client";

import AccordionSection from "@/components/shared/AccordionSection";
import Badge from "@/components/shared/Badge";
import { useChartStore } from "@/store/chartStore";
import type { Candle } from "@/types/market";

interface SymbolInfoPanelProps {
  candles: Candle[];
  loading: boolean;
}

export default function SymbolInfoPanel({ candles, loading }: SymbolInfoPanelProps) {
  const { ticker } = useChartStore();
  const latest = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  const change = latest && previous ? latest.close - previous.close : 0;
  const changePct = previous ? (change / previous.close) * 100 : 0;

  return (
    <AccordionSection title="Symbol Info">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">{ticker}</div>
          <div className="text-xs text-slate-400">Market Simulation Equity</div>
        </div>
        <Badge tone={change >= 0 ? "success" : "danger"}>
          {change >= 0 ? "OPEN" : "CLOSED"}
        </Badge>
      </div>

      <div className="mt-4 rounded-lg border border-[#2a2e39] bg-[#0f131b] px-3 py-2">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Last Price
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-mono text-2xl text-slate-100">
            {latest ? latest.close.toFixed(2) : "--"}
          </span>
          <span
            className={`text-xs font-semibold ${
              change >= 0 ? "text-[#26a69a]" : "text-[#ef5350]"
            }`}
          >
            {loading ? "--" : `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${changePct.toFixed(2)}%)`}
          </span>
        </div>
      </div>
    </AccordionSection>
  );
}

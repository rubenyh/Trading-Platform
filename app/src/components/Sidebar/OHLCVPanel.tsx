"use client";

import AccordionSection from "@/components/shared/AccordionSection";
import { useChartStore } from "@/store/chartStore";
import type { Candle } from "@/types/market";

interface OHLCVPanelProps {
  candles: Candle[];
}

const formatValue = (value?: number) =>
  value === undefined ? "--" : value.toFixed(2);

export default function OHLCVPanel({ candles }: OHLCVPanelProps) {
  const { hoveredCandle } = useChartStore();
  const candle = hoveredCandle ?? candles[candles.length - 1];

  return (
    <AccordionSection title="OHLCV">
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
        <div>
          <div>Open</div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {formatValue(candle?.open)}
          </div>
        </div>
        <div>
          <div>High</div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {formatValue(candle?.high)}
          </div>
        </div>
        <div>
          <div>Low</div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {formatValue(candle?.low)}
          </div>
        </div>
        <div>
          <div>Close</div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {formatValue(candle?.close)}
          </div>
        </div>
        <div>
          <div>Volume</div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {candle ? candle.volume.toLocaleString() : "--"}
          </div>
        </div>
      </div>
    </AccordionSection>
  );
}

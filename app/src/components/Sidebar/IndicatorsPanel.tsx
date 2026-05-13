"use client";

import AccordionSection from "@/components/shared/AccordionSection";
import { useChartStore } from "@/store/chartStore";

const INDICATORS = [
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "bb", label: "Bollinger Bands" },
  { key: "ema20", label: "EMA 20" },
  { key: "ema50", label: "EMA 50" },
  { key: "ema200", label: "EMA 200" },
] as const;

export default function IndicatorsPanel() {
  const { indicators, toggleIndicator } = useChartStore();

  return (
    <AccordionSection title="Technical Indicators" defaultOpen={false}>
      <div className="flex flex-col gap-3 text-xs text-slate-400">
        {INDICATORS.map((indicator) => (
          <div key={indicator.key} className="flex items-center justify-between">
            <span>{indicator.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={indicators[indicator.key]}
              onClick={() => toggleIndicator(indicator.key)}
              className={`h-5 w-10 rounded-full border transition ${
                indicators[indicator.key]
                  ? "border-[#7b61ff] bg-[#2a2242]"
                  : "border-[#2a2e39] bg-[#0f131b]"
              }`}
            >
              <span
                className={`block h-4 w-4 translate-x-0.5 rounded-full bg-slate-200 transition ${
                  indicators[indicator.key] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

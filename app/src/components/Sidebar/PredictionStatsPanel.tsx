"use client";

import AccordionSection from "@/components/shared/AccordionSection";
import Badge from "@/components/shared/Badge";
import type { PredictionResult } from "@/types/market";

interface PredictionStatsPanelProps {
  prediction: PredictionResult | null;
}

export default function PredictionStatsPanel({ prediction }: PredictionStatsPanelProps) {
  const confidencePct = prediction ? Math.round(prediction.confidence * 100) : 0;

  return (
    <AccordionSection title="Prediction Stats" defaultOpen={false}>
      {prediction ? (
        <div className="flex flex-col gap-3 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Model</span>
            <span className="font-mono text-slate-100">{prediction.model}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Horizon</span>
            <span className="font-mono text-slate-100">Next {prediction.horizon} days</span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span>Confidence</span>
              <span className="font-mono text-slate-100">{confidencePct}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#0f131b]">
              <div
                className="h-2 rounded-full bg-[#7b61ff]"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Direction</span>
            <Badge tone={prediction.direction === "up" ? "success" : "danger"}>
              {prediction.direction === "up" ? "UP" : "DOWN"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Target</span>
            <span className="font-mono text-slate-100">
              ${prediction.targetPrice.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500">
          Run a prediction to see model output.
        </div>
      )}
    </AccordionSection>
  );
}

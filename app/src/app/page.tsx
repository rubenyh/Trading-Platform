"use client";

import { useEffect, useState } from "react";
import ChartContainer from "@/components/Chart/ChartContainer";
import Toolbar from "@/components/Toolbar/Toolbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useStockData } from "@/hooks/useStockData";
import { usePrediction } from "@/hooks/usePrediction";
import { useChartStore } from "@/store/chartStore";

export default function Home() {
  const { prediction } = useChartStore();
  const stockState = useStockData();
  const predictionState = usePrediction();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!prediction) {
      return;
    }

    setToast(
      `Prediction ready: ${prediction.ticker} ${
        prediction.direction === "up" ? "\u25b2" : "\u25bc"
      } $${prediction.targetPrice.toFixed(2)}`
    );

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [prediction]);

  return (
    <div className="relative min-h-screen bg-[#131722] text-slate-200">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_0%,rgba(123,97,255,0.16),transparent_60%),radial-gradient(50%_40%_at_80%_10%,rgba(38,166,154,0.12),transparent_60%)]" />
        <div className="absolute inset-0 grid-sheen" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Toolbar
          onRunPrediction={predictionState.runPrediction}
          predictionLoading={predictionState.isLoading}
        />

        <div className="flex flex-1 gap-0">
          <main className="flex min-w-0 flex-1 flex-col px-6 pb-6 pt-5">
            <div className="flex flex-1 flex-col gap-4">
              <ChartContainer
                candles={stockState.data}
                prediction={prediction}
                loading={stockState.isLoading}
              />
            </div>
          </main>

          <Sidebar
            candles={stockState.data}
            loading={stockState.isLoading}
            prediction={prediction}
          />
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 rounded-full border border-[#2a2e39] bg-[#1e222d] px-4 py-2 text-sm text-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

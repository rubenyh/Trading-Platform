"use client";

import { useCallback, useRef, useState } from "react";
import { runPrediction } from "@/services/predictionService";
import { useChartStore } from "@/store/chartStore";
import type { PredictionResult } from "@/types/market";

interface PredictionState {
  runPrediction: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function usePrediction(): PredictionState {
  const { ticker, timeframe, setPrediction } = useChartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await runPrediction({
        ticker,
        timeframe,
        model: "lstm",
        horizon: 5,
        signal: controller.signal,
      });

      const result: PredictionResult = {
        ticker,
        model: response.model,
        horizon: response.horizon,
        confidence: response.confidence,
        direction: response.direction,
        targetPrice: response.target_price,
        predictions: response.predictions,
      };

      setPrediction(result);
    } catch (predictionError) {
      if (!controller.signal.aborted) {
        setError((predictionError as Error).message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [ticker, timeframe, setPrediction]);

  return {
    runPrediction: run,
    isLoading,
    error,
  };
}

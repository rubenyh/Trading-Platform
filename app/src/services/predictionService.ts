import type { PredictionResponse, Timeframe } from "@/types/market";

interface PredictionRequest {
  ticker: string;
  timeframe: Timeframe;
  model: string;
  horizon: number;
  signal?: AbortSignal;
}

export async function runPrediction({
  ticker,
  timeframe,
  model,
  horizon,
  signal,
}: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticker, timeframe, model, horizon }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to run prediction.");
  }

  return response.json();
}

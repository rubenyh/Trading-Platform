import type { StockResponse, Timeframe } from "@/types/market";

interface StockRequest {
  ticker: string;
  timeframe: Timeframe;
  limit?: number;
  signal?: AbortSignal;
}

export async function fetchStockData({
  ticker,
  timeframe,
  limit = 200,
  signal,
}: StockRequest): Promise<StockResponse> {
  const url = `/api/stocks/${ticker}?timeframe=${encodeURIComponent(
    timeframe
  )}&limit=${limit}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch stock data.");
  }

  return response.json();
}

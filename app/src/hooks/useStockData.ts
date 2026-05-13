"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchStockData } from "@/services/stockService";
import { useChartStore } from "@/store/chartStore";
import type { Candle, StockResponse } from "@/types/market";

interface StockState {
  data: Candle[];
  name: string;
  isLoading: boolean;
  error: string | null;
}

const mockCandles = (count: number): Candle[] => {
  const candles: Candle[] = [];
  const now = Date.now();
  let price = 182;

  for (let i = count - 1; i >= 0; i -= 1) {
    const time = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    const open = price + (Math.random() - 0.5) * 2.5;
    const close = open + (Math.random() - 0.5) * 3.2;
    const high = Math.max(open, close) + Math.random() * 1.8;
    const low = Math.min(open, close) - Math.random() * 1.6;
    const volume = Math.round(42000000 + Math.random() * 12000000);

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return candles;
};

export function useStockData(): StockState {
  const { ticker, timeframe } = useChartStore();
  const [state, setState] = useState<StockState>({
    data: [],
    name: "",
    isLoading: true,
    error: null,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const fallback = useMemo(() => mockCandles(120), []);

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    fetchStockData({
      ticker,
      timeframe,
      signal: controller.signal,
    })
      .then((response: StockResponse) => {
        setState({
          data: response.data,
          name: response.name,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: Error) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          data: fallback,
          name: "Demo Equity",
          isLoading: false,
          error: error.message,
        });
      });

    return () => controller.abort();
  }, [ticker, timeframe, fallback]);

  return state;
}

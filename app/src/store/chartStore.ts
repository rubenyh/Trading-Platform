import { create } from "zustand";
import type { Candle, ChartType, PredictionResult, Timeframe } from "@/types/market";

type IndicatorKey = "rsi" | "macd" | "bb" | "ema20" | "ema50" | "ema200";

interface ChartState {
  ticker: string;
  timeframe: Timeframe;
  chartType: ChartType;
  prediction: PredictionResult | null;
  hoveredCandle: Candle | null;
  indicators: Record<IndicatorKey, boolean>;
  sidebarCollapsed: boolean;
  setTicker: (ticker: string) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setChartType: (chartType: ChartType) => void;
  setPrediction: (prediction: PredictionResult | null) => void;
  setHoveredCandle: (candle: Candle | null) => void;
  toggleIndicator: (key: IndicatorKey) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  ticker: "AAPL",
  timeframe: "1D",
  chartType: "candlestick",
  prediction: null,
  hoveredCandle: null,
  indicators: {
    rsi: true,
    macd: false,
    bb: false,
    ema20: true,
    ema50: true,
    ema200: false,
  },
  sidebarCollapsed: false,
  setTicker: (ticker) => set({ ticker: ticker.toUpperCase() }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setChartType: (chartType) => set({ chartType }),
  setPrediction: (prediction) => set({ prediction }),
  setHoveredCandle: (candle) => set({ hoveredCandle: candle }),
  toggleIndicator: (key) =>
    set((state) => ({
      indicators: {
        ...state.indicators,
        [key]: !state.indicators[key],
      },
    })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));

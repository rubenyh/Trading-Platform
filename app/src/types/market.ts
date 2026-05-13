export type Timeframe = "1m" | "5m" | "15m" | "1H" | "4H" | "1D" | "1W" | "1M";

export type ChartType = "candlestick" | "line" | "area";

export type PredictionDirection = "up" | "down";

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockResponse {
  ticker: string;
  name: string;
  data: Candle[];
}

export interface PredictionPoint {
  time: string;
  value: number;
  upper: number;
  lower: number;
}

export interface PredictionResponse {
  model: string;
  horizon: number;
  confidence: number;
  direction: PredictionDirection;
  target_price: number;
  predictions: PredictionPoint[];
}

export interface PredictionResult {
  ticker: string;
  model: string;
  horizon: number;
  confidence: number;
  direction: PredictionDirection;
  targetPrice: number;
  predictions: PredictionPoint[];
}

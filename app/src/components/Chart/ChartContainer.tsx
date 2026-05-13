"use client";

import {
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type CandlestickData,
  type HistogramData,
  type IChartApi,
  type LineData,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import type { Candle, PredictionResult } from "@/types/market";
import { useChartStore } from "@/store/chartStore";
import { useChartSync } from "@/hooks/useChartSync";
import MainChart from "@/components/Chart/MainChart";
import VolumeChart from "@/components/Chart/VolumeChart";
import PredictionOverlay from "@/components/Chart/PredictionOverlay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ChartContainerProps {
  candles: Candle[];
  prediction: PredictionResult | null;
  loading: boolean;
}

const toTimestamp = (time: string): UTCTimestamp =>
  Math.floor(new Date(time).getTime() / 1000) as UTCTimestamp;

const toUtcTimestampFromTime = (time: Time): UTCTimestamp | null => {
  if (typeof time === "number") {
    return time as UTCTimestamp;
  }
  if (typeof time === "string") {
    const parsed = Date.parse(time);
    return Number.isNaN(parsed) ? null : (Math.floor(parsed / 1000) as UTCTimestamp);
  }
  if (time && typeof time === "object" && "year" in time) {
    const utcMs = Date.UTC(time.year, time.month - 1, time.day);
    return Math.floor(utcMs / 1000) as UTCTimestamp;
  }
  return null;
};

export default function ChartContainer({
  candles,
  prediction,
  loading,
}: ChartContainerProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);
  const [mainChart, setMainChart] = useState<IChartApi | null>(null);
  const [volumeChart, setVolumeChart] = useState<IChartApi | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi["addCandlestickSeries"]> | null>(
    null
  );
  const lineSeriesRef = useRef<ReturnType<IChartApi["addLineSeries"]> | null>(null);
  const areaSeriesRef = useRef<ReturnType<IChartApi["addAreaSeries"]> | null>(null);
  const volumeSeriesRef = useRef<ReturnType<IChartApi["addHistogramSeries"]> | null>(null);
  const predictionSeriesRef = useRef<ReturnType<IChartApi["addLineSeries"]> | null>(null);
  const predictionUpperRef = useRef<ReturnType<IChartApi["addLineSeries"]> | null>(null);
  const predictionLowerRef = useRef<ReturnType<IChartApi["addLineSeries"]> | null>(null);
  const predictionBandRef = useRef<ReturnType<IChartApi["addAreaSeries"]> | null>(null);
  const { chartType, hoveredCandle, setHoveredCandle } = useChartStore();
  const [predictionMarkerX, setPredictionMarkerX] = useState<number | null>(null);

  const candleMapRef = useRef<Map<number, Candle>>(new Map());

  useChartSync(mainChart, volumeChart);

  useEffect(() => {
    const map = new Map<number, Candle>();
    candles.forEach((candle) => {
      map.set(toTimestamp(candle.time), candle);
    });
    candleMapRef.current = map;
  }, [candles]);

  useEffect(() => {
    if (!mainContainerRef.current || !volumeContainerRef.current) {
      return;
    }

    const mainSize = {
      width: mainContainerRef.current.clientWidth,
      height: mainContainerRef.current.clientHeight,
    };
    const volumeSize = {
      width: volumeContainerRef.current.clientWidth,
      height: volumeContainerRef.current.clientHeight,
    };

    const mainChart = createChart(mainContainerRef.current, {
      autoSize: false,
      ...mainSize,
      layout: {
        background: { type: ColorType.Solid, color: "#131722" },
        textColor: "#c9d0dd",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#222633" },
        horzLines: { color: "#222633" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#2a2e39",
      },
      timeScale: {
        borderColor: "#2a2e39",
      },
    });

    const volumeChart = createChart(volumeContainerRef.current, {
      autoSize: false,
      ...volumeSize,
      layout: {
        background: { type: ColorType.Solid, color: "#131722" },
        textColor: "#c9d0dd",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1d212c" },
        horzLines: { color: "#1d212c" },
      },
      rightPriceScale: {
        borderColor: "#2a2e39",
      },
      timeScale: {
        borderColor: "#2a2e39",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    chartRef.current = mainChart;
    volumeChartRef.current = volumeChart;
    setMainChart(mainChart);
    setVolumeChart(volumeChart);

    candleSeriesRef.current = mainChart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderVisible: false,
    });

    lineSeriesRef.current = mainChart.addLineSeries({
      color: "#7fe3d8",
      lineWidth: 2,
    });

    areaSeriesRef.current = mainChart.addAreaSeries({
      lineColor: "#7fe3d8",
      topColor: "rgba(38,166,154,0.35)",
      bottomColor: "rgba(19,23,34,0.0)",
      lineWidth: 2,
    });

    predictionSeriesRef.current = mainChart.addLineSeries({
      color: "#7b61ff",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
    });

    predictionUpperRef.current = mainChart.addLineSeries({
      color: "rgba(123,97,255,0.7)",
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
    });

    predictionLowerRef.current = mainChart.addLineSeries({
      color: "rgba(123,97,255,0.7)",
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
    });

    predictionBandRef.current = mainChart.addAreaSeries({
      lineColor: "rgba(123,97,255,0.0)",
      topColor: "rgba(123,97,255,0.12)",
      bottomColor: "rgba(123,97,255,0.02)",
    });

    volumeSeriesRef.current = volumeChart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeChart.priceScale("").applyOptions({
      scaleMargins: { top: 0.2, bottom: 0 },
    });

    const handleCrosshair = (param: MouseEventParams<Time>) => {
      if (!param.time) {
        setHoveredCandle(null);
        return;
      }

      const timeKey = toUtcTimestampFromTime(param.time);
      if (!timeKey) {
        setHoveredCandle(null);
        return;
      }
      const candle = candleMapRef.current.get(timeKey);
      if (candle) {
        setHoveredCandle(candle);
      }
    };

    mainChart.subscribeCrosshairMove(handleCrosshair);

    const resizeObserver = new ResizeObserver(() => {
      mainChart.applyOptions({
        width: mainContainerRef.current?.clientWidth,
        height: mainContainerRef.current?.clientHeight,
      });
      volumeChart.applyOptions({
        width: volumeContainerRef.current?.clientWidth,
        height: volumeContainerRef.current?.clientHeight,
      });
    });

    resizeObserver.observe(mainContainerRef.current);
    resizeObserver.observe(volumeContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      mainChart.unsubscribeCrosshairMove(handleCrosshair);
      mainChart.remove();
      volumeChart.remove();
    };
  }, [setHoveredCandle]);

  useEffect(() => {
    if (!candleSeriesRef.current || !lineSeriesRef.current || !areaSeriesRef.current) {
      return;
    }

    const candleData: CandlestickData[] = candles.map((candle) => ({
      time: toTimestamp(candle.time),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const lineData: LineData[] = candles.map((candle) => ({
      time: toTimestamp(candle.time),
      value: candle.close,
    }));

    candleSeriesRef.current.setData(candleData);
    lineSeriesRef.current.setData(lineData);
    areaSeriesRef.current.setData(lineData);

    candleSeriesRef.current.applyOptions({ visible: chartType === "candlestick" });
    lineSeriesRef.current.applyOptions({ visible: chartType === "line" });
    areaSeriesRef.current.applyOptions({ visible: chartType === "area" });

    chartRef.current?.timeScale().fitContent();
  }, [candles, chartType]);

  useEffect(() => {
    if (!volumeSeriesRef.current) {
      return;
    }

    const volumeData: HistogramData[] = candles.map((candle) => ({
      time: toTimestamp(candle.time),
      value: candle.volume,
      color: candle.close >= candle.open ? "rgba(38,166,154,0.7)" : "rgba(239,83,80,0.7)",
    }));

    volumeSeriesRef.current.setData(volumeData);
  }, [candles]);

  useEffect(() => {
    if (!predictionSeriesRef.current || !predictionUpperRef.current || !predictionLowerRef.current) {
      return;
    }

    if (!prediction) {
      predictionSeriesRef.current.setData([]);
      predictionUpperRef.current.setData([]);
      predictionLowerRef.current.setData([]);
      predictionBandRef.current?.setData([]);
      setPredictionMarkerX(null);
      return;
    }

    const predictionData: LineData[] = prediction.predictions.map((point) => ({
      time: toTimestamp(point.time),
      value: point.value,
    }));

    predictionSeriesRef.current.setData(predictionData);
    predictionUpperRef.current.setData(
      prediction.predictions.map((point) => ({
        time: toTimestamp(point.time),
        value: point.upper,
      }))
    );
    predictionLowerRef.current.setData(
      prediction.predictions.map((point) => ({
        time: toTimestamp(point.time),
        value: point.lower,
      }))
    );
    predictionBandRef.current?.setData(predictionData);
  }, [prediction]);

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) {
      setPredictionMarkerX(null);
      return;
    }

    const lastCandleTime = toTimestamp(candles[candles.length - 1].time);

    const updateMarker = () => {
      const coord = chartRef.current?.timeScale().timeToCoordinate(lastCandleTime);
      setPredictionMarkerX(coord ?? null);
    };

    updateMarker();
    chartRef.current.timeScale().subscribeVisibleTimeRangeChange(updateMarker);

    return () => {
      chartRef.current?.timeScale().unsubscribeVisibleTimeRangeChange(updateMarker);
    };
  }, [candles, prediction]);

  return (
    <section className="flex flex-col gap-4">
      <div className="relative">
        <MainChart ref={mainContainerRef} />
        <PredictionOverlay markerX={prediction ? predictionMarkerX : null} />
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-[#2a2e39] bg-[#1e222d]/80 px-3 py-2 text-xs text-slate-200 shadow-lg">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Crosshair</div>
          {(() => {
            const active = hoveredCandle ?? candles[candles.length - 1];
            if (!active) {
              return <div className="mt-1 font-mono text-sm">--</div>;
            }

            return (
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                <span>O {active.open.toFixed(2)}</span>
                <span>H {active.high.toFixed(2)}</span>
                <span>L {active.low.toFixed(2)}</span>
                <span>C {active.close.toFixed(2)}</span>
              </div>
            );
          })()}
        </div>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#131722]/80">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>

      <div className="relative">
        <VolumeChart ref={volumeContainerRef} />
        <div className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          Volume
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2e39] bg-[#1e222d] px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Indicator
          </span>
          <span className="text-xs text-slate-500">RSI / MACD</span>
        </div>
        <div className="mt-4 h-14 rounded-xl bg-[#131722]">
          <div className="loading-shimmer h-full w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}

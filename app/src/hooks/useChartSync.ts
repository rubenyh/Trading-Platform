"use client";

import { useEffect, useRef } from "react";
import type { IChartApi } from "lightweight-charts";

export function useChartSync(mainChart: IChartApi | null, volumeChart: IChartApi | null) {
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!mainChart || !volumeChart) {
      return;
    }

    console.debug("[ChartSync] Charts ready", { mainChart: !!mainChart, volumeChart: !!volumeChart });

    type VisibleRange = ReturnType<ReturnType<IChartApi["timeScale"]>["getVisibleRange"]>;
    const isValidRange = (range: VisibleRange): range is NonNullable<VisibleRange> =>
      !!range && range.from != null && range.to != null;

    const syncFromMain = () => {
      if (!mainChart || !volumeChart) {
        return;
      }
      if (isSyncingRef.current) {
        return;
      }
      isSyncingRef.current = true;
      console.debug("[ChartSync] Sync from main start");
      const range = mainChart.timeScale().getVisibleRange();
      if (!isValidRange(range)) {
        console.debug("[ChartSync] Invalid range from main", range);
        isSyncingRef.current = false;
        return;
      }
      try {
        volumeChart.timeScale().setVisibleRange(range);
      } catch (err) {
        console.warn("[ChartSync] Failed to sync from main", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    const syncFromVolume = () => {
      if (!mainChart || !volumeChart) {
        return;
      }
      if (isSyncingRef.current) {
        return;
      }
      isSyncingRef.current = true;
      console.debug("[ChartSync] Sync from volume start");
      const range = volumeChart.timeScale().getVisibleRange();
      if (!isValidRange(range)) {
        console.debug("[ChartSync] Invalid range from volume", range);
        isSyncingRef.current = false;
        return;
      }
      try {
        mainChart.timeScale().setVisibleRange(range);
      } catch (err) {
        console.warn("[ChartSync] Failed to sync from volume", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    mainChart.timeScale().subscribeVisibleTimeRangeChange(syncFromMain);
    volumeChart.timeScale().subscribeVisibleTimeRangeChange(syncFromVolume);
    console.debug("[ChartSync] Subscriptions active");

    return () => {
      mainChart.timeScale().unsubscribeVisibleTimeRangeChange(syncFromMain);
      volumeChart.timeScale().unsubscribeVisibleTimeRangeChange(syncFromVolume);
      console.debug("[ChartSync] Subscriptions cleaned up");
    };
  }, [mainChart, volumeChart]);
}

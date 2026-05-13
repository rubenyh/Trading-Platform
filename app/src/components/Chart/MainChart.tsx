"use client";

import { forwardRef } from "react";

interface MainChartProps {
  className?: string;
}

const MainChart = forwardRef<HTMLDivElement, MainChartProps>(function MainChart(
  { className },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative h-105 w-full overflow-hidden rounded-2xl border border-[#2a2e39] bg-[#131722] ${
        className ?? ""
      }`}
    />
  );
});

export default MainChart;

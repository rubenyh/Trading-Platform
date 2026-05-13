"use client";

import { forwardRef } from "react";

interface VolumeChartProps {
  className?: string;
}

const VolumeChart = forwardRef<HTMLDivElement, VolumeChartProps>(function VolumeChart(
  { className },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative h-35 w-full overflow-hidden rounded-2xl border border-[#2a2e39] bg-[#131722] ${
        className ?? ""
      }`}
    />
  );
});

export default VolumeChart;

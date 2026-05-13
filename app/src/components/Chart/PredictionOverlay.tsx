import Badge from "@/components/shared/Badge";

interface PredictionOverlayProps {
  markerX: number | null;
}

export default function PredictionOverlay({ markerX }: PredictionOverlayProps) {
  if (markerX === null) {
    return null;
  }

  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 top-0 h-full w-px border-l border-dashed border-[#7b61ff]/60"
        style={{ left: markerX }}
      />
      <div
        className="pointer-events-none absolute top-4"
        style={{ left: markerX + 12 }}
      >
        <Badge tone="info">Predicted</Badge>
      </div>
    </>
  );
}

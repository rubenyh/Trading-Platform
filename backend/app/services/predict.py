import math
from datetime import datetime, timedelta
from typing import Literal

from app.constants.market import Timeframe, TIMEFRAME_TO_MINUTES
from app.schemas.predict import (
    PredictionPoint,
    PredictionRequest,
    PredictionResponse,
)


def build_prediction_points(
    horizon: int,
    timeframe: Timeframe,
    base_price: float,
    direction: Literal["up", "down"],
) -> list[PredictionPoint]:
    minutes = TIMEFRAME_TO_MINUTES.get(timeframe, 1)
    now = datetime.utcnow().replace(microsecond=0)
    points: list[PredictionPoint] = []

    slope = 0.35 if direction == "up" else -0.35

    for index in range(1, horizon + 1):
        timestamp = now + timedelta(minutes=minutes * index)
        drift = slope * index
        wave = math.sin(index / 2.5) * 0.6
        value = base_price + drift + wave
        spread = max(0.4, abs(wave) * 0.6)

        points.append(
            PredictionPoint(
                time=timestamp.isoformat() + "Z",
                value=round(value, 2),
                upper=round(value + spread, 2),
                lower=round(value - spread, 2),
            )
        )

    return points


def generate_prediction(payload: PredictionRequest) -> PredictionResponse:
    base_price = 101.5
    direction: Literal["up", "down"] = "up" if payload.horizon % 2 == 0 else "down"
    predictions = build_prediction_points(
        payload.horizon,
        payload.timeframe,
        base_price,
        direction,
    )

    target_price = predictions[-1].value if predictions else base_price

    return PredictionResponse(
        model=payload.model,
        horizon=payload.horizon,
        confidence=0.72,
        direction=direction,
        target_price=round(target_price, 2),
        predictions=predictions,
    )

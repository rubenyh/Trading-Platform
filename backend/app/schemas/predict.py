from typing import Literal

from pydantic import BaseModel, Field
from app.constants.market import Timeframe


class PredictionRequest(BaseModel):
    ticker: str
    timeframe: Timeframe
    model: str
    horizon: int = Field(..., ge=1, le=60)


class PredictionPoint(BaseModel):
    time: str
    value: float
    upper: float
    lower: float


class PredictionResponse(BaseModel):
    model: str
    horizon: int
    confidence: float
    direction: Literal["up", "down"]
    target_price: float
    predictions: list[PredictionPoint]

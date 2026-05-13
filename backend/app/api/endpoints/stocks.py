import math
from datetime import datetime, timedelta
from typing import Literal

from fastapi import APIRouter, Query

from app.schemas.stocks import CandleModel, StockResponseModel
from app.constants.market import Timeframe, TIMEFRAME_TO_MINUTES

router = APIRouter()

def build_dummy_candles(
    timeframe: Timeframe,
    limit: int,
    trend: float,
    volatility: float,
) -> list[CandleModel]:
    minutes = TIMEFRAME_TO_MINUTES.get(timeframe, 1)
    now = datetime.utcnow().replace(microsecond=0)
    candles: list[CandleModel] = []

    for index in range(limit):
        offset = minutes * (limit - 1 - index)
        timestamp = now - timedelta(minutes=offset)
        base_price = 100 + (index * trend)
        noise = math.sin(index / 3) * volatility
        open_price = base_price + noise
        close_price = base_price + noise + (trend * 0.1)
        wick = max(volatility * 0.6, 0.1)
        high_price = max(open_price, close_price) + wick
        low_price = min(open_price, close_price) - wick
        volume = 1000 + (index * 10) + (abs(noise) * 50)

        candles.append(
            CandleModel(
                time=timestamp.isoformat() + "Z",
                open=round(open_price, 2),
                high=round(high_price, 2),
                low=round(low_price, 2),
                close=round(close_price, 2),
                volume=round(volume, 2),
            )
        )

    return candles


@router.get("/{ticker}", response_model=StockResponseModel)
async def get_stock_data(
    ticker: str,
    timeframe: Timeframe = Query(...),
    limit: int = Query(200, ge=1, le=1000),
    trend: float = Query(0.2, description="Per-candle trend delta."),
    volatility: float = Query(
        0.3,
        ge=0,
        description="Noise amplitude for candle spread and wicks.",
    ),
):
    return StockResponseModel(
        ticker=ticker.upper(),
        name=f"{ticker.upper()} Corp",
        data=build_dummy_candles(timeframe, limit, trend, volatility),
    )

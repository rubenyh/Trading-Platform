from fastapi import APIRouter, Query

from app.constants.market import Timeframe
from app.schemas.stocks import StockResponseModel
from app.services.stocks import build_dummy_candles

router = APIRouter()


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

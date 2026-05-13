from pydantic import BaseModel


class CandleModel(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class StockResponseModel(BaseModel):
    ticker: str
    name: str
    data: list[CandleModel]

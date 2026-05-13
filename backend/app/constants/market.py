from typing import Literal

Timeframe = Literal[
    "1m",
    "5m",
    "15m",
    "1H",
    "4H",
    "1D",
    "1W",
    "1M",
]

TIMEFRAME_TO_MINUTES: dict[Timeframe, int] = {
    "1m": 1,
    "5m": 5,
    "15m": 15,
    "1H": 60,
    "4H": 240,
    "1D": 1440,
    "1W": 10080,
    "1M": 43200,
}

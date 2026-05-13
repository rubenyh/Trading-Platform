from fastapi import APIRouter
from app.api.endpoints.health import router as health_router
from app.api.endpoints.predict import router as predict_router
from app.api.endpoints.stocks import router as stocks_router

api_router = APIRouter()

api_router.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

api_router.include_router(
    stocks_router,
    prefix="/stocks",
    tags=["Stocks"]
)

api_router.include_router(
    predict_router,
    prefix="/predict",
    tags=["Predictions"]
)

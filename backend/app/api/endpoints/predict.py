from fastapi import APIRouter

from app.schemas.predict import PredictionRequest, PredictionResponse
from app.services.predict import generate_prediction


router = APIRouter()


@router.post("", response_model=PredictionResponse)
async def run_prediction(payload: PredictionRequest):
    return generate_prediction(payload)

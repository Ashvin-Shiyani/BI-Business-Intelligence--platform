from fastapi import APIRouter
from services.forecast_service import forecast_revenue

router = APIRouter()

@router.get("/forecast")
def forecast():
    return forecast_revenue()
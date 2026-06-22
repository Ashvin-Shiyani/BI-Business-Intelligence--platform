from fastapi import APIRouter
from services.anomaly_service import detect_anomalies

router = APIRouter()

@router.get("/anomalies")
def anomalies():
    return detect_anomalies()
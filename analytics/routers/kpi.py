from fastapi import APIRouter
from services.kpi_service import get_kpi_summary

router = APIRouter()

@router.get("/kpi/summary")
def kpi_summary():
    return get_kpi_summary()
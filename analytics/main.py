from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import kpi, anomaly, forecast

app = FastAPI(title="BI Analytics Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(kpi.router, prefix="/analytics")
app.include_router(anomaly.router, prefix="/analytics")
app.include_router(forecast.router, prefix="/analytics")

@app.get("/")
def root():
    return {"message": "BI Analytics Engine is running!"}
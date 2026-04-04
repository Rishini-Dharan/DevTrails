"""
GigShield ML Service — FastAPI
Provides risk scoring, fraud detection, premium calculation,
and predictive analytics endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.risk_scorer import calculate_zone_risk
from models.fraud_detector import detect_fraud, detect_fraud_advanced
from models.premium_calculator import calculate_premium
from models.predictive_analytics import forecast_next_week, get_zone_heatmap
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(
    title="GigShield ML Service",
    description="AI-powered risk scoring, fraud detection, premium calculation, and predictive analytics",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──
@app.get("/health")
def health():
    return {"status": "ok", "service": "GigShield ML Service", "version": "2.0.0"}


# ── Risk Score Endpoint ──
@app.get("/risk-score")
def risk_score(zone: str = "andheri west", city: str = "mumbai", pincode: str = "400058"):
    result = calculate_zone_risk(zone, city, pincode)
    return result


# ── Premium Calculation Endpoint ──
@app.get("/premium")
def premium(
    zone: str = "andheri west",
    city: str = "mumbai",
    pincode: str = "400058",
    plan: str = "standard",
):
    result = calculate_premium(zone, city, pincode, plan)
    return result


# ── Fraud Detection (Original) ──
class FraudCheckRequest(BaseModel):
    userId: str = "demo-user"
    zone: str = "andheri west"
    triggerType: str = "TRG-RAIN"
    trustScore: float = 0.5
    gpsLat: Optional[float] = None
    gpsLon: Optional[float] = None


@app.post("/fraud-check")
def fraud_check(req: FraudCheckRequest):
    result = detect_fraud(
        user_id=req.userId,
        zone=req.zone,
        trigger_type=req.triggerType,
        trust_score=req.trustScore,
    )
    return result


# ── Advanced Fraud Detection (Phase 3) ──
class AdvancedFraudCheckRequest(BaseModel):
    userId: str = "demo-user"
    zone: str = "andheri west"
    triggerType: str = "TRG-RAIN"
    trustScore: float = 0.5
    gpsLat: Optional[float] = None
    gpsLon: Optional[float] = None
    claimCount30d: int = 0
    triggerId: Optional[str] = None
    recentTriggerIds: Optional[List[str]] = None
    claimedValue: Optional[float] = None
    actualValue: Optional[float] = None


@app.post("/fraud-check-advanced")
def fraud_check_advanced(req: AdvancedFraudCheckRequest):
    result = detect_fraud_advanced(
        user_id=req.userId,
        zone=req.zone,
        trigger_type=req.triggerType,
        trust_score=req.trustScore,
        gps_lat=req.gpsLat,
        gps_lon=req.gpsLon,
        claim_count_30d=req.claimCount30d,
        trigger_id=req.triggerId,
        recent_trigger_ids=req.recentTriggerIds or [],
        claimed_value=req.claimedValue,
        actual_value=req.actualValue,
    )
    return result


# ── Predictive Analytics (Phase 3) ──
@app.get("/predictions")
def predictions(zone: str = "andheri west", city: str = "mumbai", active_policies: int = 50):
    result = forecast_next_week(zone, city, active_policies)
    return result


@app.get("/zone-heatmap")
def zone_heatmap(city: str = "mumbai"):
    result = get_zone_heatmap(city)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

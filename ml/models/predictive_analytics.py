"""
Predictive Analytics — Phase 3
Forecasts next-week disruption probability, expected claims volume,
and estimated payout exposure per zone using historical weather patterns.
"""

import numpy as np
from datetime import datetime
from models.risk_scorer import CITY_PROFILES, ZONE_MODIFIERS


# Monthly disruption probability baselines (simulated historical data)
MONTHLY_DISRUPTION_PROB = {
    1:  {"rain": 0.05, "heat": 0.02, "aqi": 0.40, "flood": 0.01, "curfew": 0.05},
    2:  {"rain": 0.05, "heat": 0.05, "aqi": 0.30, "flood": 0.01, "curfew": 0.04},
    3:  {"rain": 0.08, "heat": 0.15, "aqi": 0.15, "flood": 0.02, "curfew": 0.04},
    4:  {"rain": 0.10, "heat": 0.35, "aqi": 0.08, "flood": 0.03, "curfew": 0.05},
    5:  {"rain": 0.12, "heat": 0.50, "aqi": 0.05, "flood": 0.04, "curfew": 0.05},
    6:  {"rain": 0.55, "heat": 0.15, "aqi": 0.03, "flood": 0.20, "curfew": 0.06},
    7:  {"rain": 0.70, "heat": 0.08, "aqi": 0.02, "flood": 0.35, "curfew": 0.07},
    8:  {"rain": 0.65, "heat": 0.10, "aqi": 0.02, "flood": 0.30, "curfew": 0.06},
    9:  {"rain": 0.45, "heat": 0.15, "aqi": 0.05, "flood": 0.15, "curfew": 0.05},
    10: {"rain": 0.20, "heat": 0.10, "aqi": 0.15, "flood": 0.08, "curfew": 0.05},
    11: {"rain": 0.08, "heat": 0.03, "aqi": 0.50, "flood": 0.02, "curfew": 0.06},
    12: {"rain": 0.05, "heat": 0.02, "aqi": 0.55, "flood": 0.01, "curfew": 0.07},
}

AVG_PAYOUT_BY_TYPE = {
    "rain": 380, "heat": 280, "aqi": 250, "flood": 520, "curfew": 450,
}

# City profile field mapping for backward compatibility
CITY_RISK_LOOKUP = {
    "mumbai":    {"monsoon_boost": 0.7, "heatwave_risk": 0.1, "aqi_risk": 0.05, "flood_frequency": 0.3},
    "delhi":     {"monsoon_boost": 0.3, "heatwave_risk": 0.4, "aqi_risk": 0.5, "flood_frequency": 0.1},
    "bangalore": {"monsoon_boost": 0.4, "heatwave_risk": 0.15, "aqi_risk": 0.05, "flood_frequency": 0.15},
    "hyderabad": {"monsoon_boost": 0.35, "heatwave_risk": 0.25, "aqi_risk": 0.08, "flood_frequency": 0.12},
    "chennai":   {"monsoon_boost": 0.5, "heatwave_risk": 0.2, "aqi_risk": 0.03, "flood_frequency": 0.25},
    "pune":      {"monsoon_boost": 0.45, "heatwave_risk": 0.15, "aqi_risk": 0.06, "flood_frequency": 0.1},
    "kolkata":   {"monsoon_boost": 0.5, "heatwave_risk": 0.2, "aqi_risk": 0.15, "flood_frequency": 0.2},
}


def forecast_next_week(zone: str = "andheri west", city: str = "mumbai", active_policies: int = 50) -> dict:
    """
    Predict next week's disruption probability and estimated financial exposure.
    """
    city_lower = city.lower().strip()
    zone_lower = zone.lower().strip()

    profile = CITY_RISK_LOOKUP.get(city_lower, CITY_RISK_LOOKUP["mumbai"])
    zone_mod = ZONE_MODIFIERS.get(zone_lower, 1.0)

    month = datetime.now().month
    base_probs = MONTHLY_DISRUPTION_PROB.get(month, MONTHLY_DISRUPTION_PROB[1])

    disruption_forecasts = {}
    total_expected_claims = 0
    total_expected_payout = 0

    for dtype, base_prob in base_probs.items():
        city_boost = 1.0
        if dtype == "rain":
            city_boost = 1.0 + profile.get("monsoon_boost", 0) * 0.5
        elif dtype == "heat":
            city_boost = 1.0 + profile.get("heatwave_risk", 0) * 1.2
        elif dtype == "aqi":
            city_boost = 1.0 + profile.get("aqi_risk", 0) * 2.0
        elif dtype == "flood":
            city_boost = 1.0 + profile.get("flood_frequency", 0) * 1.5

        adjusted_prob = min(0.95, base_prob * city_boost * zone_mod)
        adjusted_prob += np.random.uniform(-0.03, 0.03)
        adjusted_prob = round(float(np.clip(adjusted_prob, 0.0, 0.95)), 3)

        avg_claim_rate = 0.6
        expected_claims = round(adjusted_prob * active_policies * avg_claim_rate, 1)
        avg_payout = AVG_PAYOUT_BY_TYPE.get(dtype, 300)
        expected_payout = round(expected_claims * avg_payout)

        disruption_forecasts[dtype] = {
            "probability": adjusted_prob,
            "riskLevel": "high" if adjusted_prob > 0.4 else "medium" if adjusted_prob > 0.15 else "low",
            "expectedClaims": expected_claims,
            "expectedPayout": expected_payout,
            "avgPayoutPerClaim": avg_payout,
        }

        total_expected_claims += expected_claims
        total_expected_payout += expected_payout

    max_prob = max(f["probability"] for f in disruption_forecasts.values())
    top_risk = max(disruption_forecasts.items(), key=lambda x: x[1]["probability"])

    if max_prob > 0.5:
        overall_risk = "critical"
        recommendation = f"High disruption probability in {zone}, {city}. Consider increasing reserves by 25%. Top threat: {top_risk[0].upper()} ({top_risk[1]['probability']*100:.0f}%)."
    elif max_prob > 0.25:
        overall_risk = "elevated"
        recommendation = f"Moderate disruption expected. Top threat: {top_risk[0].upper()} ({top_risk[1]['probability']*100:.0f}%). Maintain standard reserves."
    else:
        overall_risk = "normal"
        recommendation = f"Low disruption probability. Leading factor: {top_risk[0].upper()} ({top_risk[1]['probability']*100:.0f}%)."

    return {
        "zone": zone,
        "city": city,
        "forecastPeriod": "next 7 days",
        "generatedAt": datetime.now().isoformat(),
        "activePolicies": active_policies,
        "overallRisk": overall_risk,
        "recommendation": recommendation,
        "totalExpectedClaims": round(total_expected_claims, 1),
        "totalExpectedPayout": round(total_expected_payout),
        "disruptions": disruption_forecasts,
        "model": "Predictive Analytics v1.0 (historical pattern-based)",
    }


def get_zone_heatmap(city: str = "mumbai") -> list:
    """Generate risk heatmap data for all zones in a city."""
    city_lower = city.lower().strip()
    profile = CITY_RISK_LOOKUP.get(city_lower, CITY_RISK_LOOKUP["mumbai"])

    zones = []
    for zone_name, modifier in ZONE_MODIFIERS.items():
        base = 1.3  # baseline
        risk_score = base * modifier
        month = datetime.now().month
        if month in [6, 7, 8, 9]:
            risk_score += profile["monsoon_boost"] * 0.4
        elif month in [4, 5]:
            risk_score += profile["heatwave_risk"] * 0.3
        elif month in [11, 12, 1]:
            risk_score += profile["aqi_risk"] * 0.3

        risk_score += np.random.uniform(-0.05, 0.05)
        risk_score = round(float(np.clip(risk_score, 0.5, 3.0)), 2)

        zones.append({
            "zone": zone_name,
            "riskScore": risk_score,
            "riskLevel": "critical" if risk_score > 2.0 else "high" if risk_score > 1.5 else "medium" if risk_score > 1.0 else "low",
            "modifier": modifier,
        })

    zones.sort(key=lambda x: x["riskScore"], reverse=True)
    return zones

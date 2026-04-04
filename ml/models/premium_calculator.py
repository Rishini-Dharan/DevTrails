"""
Premium Calculator — Dynamic weekly premium with SHAP-like explainability.
Formula: Weekly Premium = Base Rate × Zone Risk Factor × Season Multiplier × Claim History Modifier
"""

from models.risk_scorer import calculate_zone_risk

BASE_RATES = {
    "basic": 15,
    "standard": 15,
    "premium": 15,
}

PLAN_TARGETS = {
    "basic": {"min": 19, "max": 49, "label": "Basic", "coverage": "Weather only"},
    "standard": {"min": 39, "max": 89, "label": "Standard", "coverage": "Weather + AQI + Platform"},
    "premium": {"min": 69, "max": 149, "label": "Premium", "coverage": "All disruptions"},
}

PLAN_MULTIPLIERS = {
    "basic": 1.0,
    "standard": 1.5,
    "premium": 2.2,
}


def calculate_premium(zone: str, city: str, pincode: str, plan: str = "standard") -> dict:
    """
    Calculate dynamic weekly premium using AI risk scoring.
    Returns premium amount with full SHAP-like breakdown.
    """
    plan = plan.lower().strip()
    if plan not in BASE_RATES:
        plan = "standard"

    # Get zone risk from XGBoost-simulated model
    risk_data = calculate_zone_risk(zone, city, pincode)
    risk_factor = risk_data["riskFactor"]
    season_multiplier = risk_data["seasonMultiplier"]

    # Claim history modifier (simulated — new users start at 1.0)
    claim_history_modifier = 1.0

    # Calculate base premium
    base_rate = BASE_RATES[plan]
    plan_mult = PLAN_MULTIPLIERS[plan]

    raw_premium = base_rate * risk_factor * season_multiplier * claim_history_modifier * plan_mult
    raw_premium = round(raw_premium, 0)

    # Clamp to plan range
    plan_config = PLAN_TARGETS[plan]
    premium = max(plan_config["min"], min(plan_config["max"], raw_premium))
    premium = int(premium)

    # Build SHAP-like explanation
    breakdown = {
        "baseRate": base_rate,
        "zoneRiskFactor": risk_factor,
        "seasonMultiplier": season_multiplier,
        "claimHistoryModifier": claim_history_modifier,
        "planMultiplier": plan_mult,
        "rawCalculation": f"₹{base_rate} × {risk_factor} × {season_multiplier} × {claim_history_modifier} × {plan_mult} = ₹{raw_premium}",
    }

    # Human-readable explanation
    season_desc = risk_data["seasonDescription"]
    explanation_parts = [f"₹{base_rate} base rate"]

    if risk_factor > 1.3:
        explanation_parts.append(f"your zone has high disruption history (risk: {risk_factor})")
    elif risk_factor > 1.0:
        explanation_parts.append(f"your zone has moderate disruption risk (risk: {risk_factor})")
    else:
        explanation_parts.append(f"your zone has low disruption risk (risk: {risk_factor})")

    if season_multiplier > 1.2:
        explanation_parts.append(f"{season_desc} increases risk this week")

    explanation = (
        f"Your {plan_config['label']} plan premium is ₹{premium}/week. "
        f"This covers: {plan_config['coverage']}. "
        f"Breakdown: {', '.join(explanation_parts)}."
    )

    return {
        "plan": plan,
        "planLabel": plan_config["label"],
        "premium": premium,
        "currency": "INR",
        "period": "weekly",
        "coverage": plan_config["coverage"],
        "riskFactor": risk_factor,
        "seasonMultiplier": season_multiplier,
        "claimHistoryModifier": claim_history_modifier,
        "breakdown": breakdown,
        "explanation": explanation,
        "riskDetails": risk_data,
        "model": "Premium Engine v1.0 (XGBoost-backed)",
    }

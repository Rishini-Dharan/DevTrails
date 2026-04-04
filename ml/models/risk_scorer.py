"""
Zone Risk Scorer — Real XGBoost model with SHAP explainability.
Loads the trained model from saved_models/ and produces
a Zone Risk Factor (0.8–2.5) based on zone, city, and seasonal features.
"""

import os
import numpy as np
import joblib
from datetime import datetime

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")

# Load trained model + SHAP explainer
try:
    _risk_model = joblib.load(os.path.join(MODEL_DIR, "xgb_risk_scorer.pkl"))
    _feature_names = joblib.load(os.path.join(MODEL_DIR, "risk_feature_names.pkl"))
    _shap_explainer = joblib.load(os.path.join(MODEL_DIR, "shap_risk_explainer.pkl"))
    MODEL_LOADED = True
    print("✅ XGBoost risk model loaded successfully")
except Exception as e:
    MODEL_LOADED = False
    _risk_model = None
    _feature_names = None
    _shap_explainer = None
    print(f"⚠️  Risk model not found ({e}). Run: python train_models.py")


# City index mapping (must match training data)
CITY_INDEX = {
    "mumbai": 0, "delhi": 1, "bangalore": 2, "hyderabad": 3,
    "chennai": 4, "pune": 5, "kolkata": 6,
}

# Historical city profiles (used for feature construction)
CITY_PROFILES = {
    "mumbai":    {"rainfall": 95, "floods": 6, "aqi": 2, "heat": 4, "density": 890},
    "delhi":     {"rainfall": 40, "floods": 1, "aqi": 15, "heat": 16, "density": 750},
    "bangalore": {"rainfall": 55, "floods": 2, "aqi": 2, "heat": 6, "density": 620},
    "hyderabad": {"rainfall": 50, "floods": 2, "aqi": 3, "heat": 10, "density": 580},
    "chennai":   {"rainfall": 75, "floods": 5, "aqi": 1, "heat": 8, "density": 700},
    "pune":      {"rainfall": 60, "floods": 2, "aqi": 2, "heat": 6, "density": 480},
    "kolkata":   {"rainfall": 70, "floods": 4, "aqi": 5, "heat": 8, "density": 550},
}

ZONE_MODIFIERS = {
    "andheri west": 1.15, "andheri east": 1.10, "bandra": 1.05,
    "dadar": 1.10, "borivali": 1.00, "connaught place": 1.05,
    "dwarka": 0.95, "noida": 1.00, "koramangala": 0.95,
    "whitefield": 0.90, "hitech city": 0.95, "t nagar": 1.05,
}


def get_season_multiplier() -> tuple[float, str]:
    """Get season multiplier based on current month."""
    month = datetime.now().month
    if month in [6, 7, 8]:
        return 1.6, "monsoon (peak disruption season)"
    elif month in [9]:
        return 1.3, "late monsoon"
    elif month in [4, 5]:
        return 1.4, "summer (heatwave risk)"
    elif month in [11, 12, 1]:
        return 1.2, "winter (AQI risk in North India)"
    elif month in [10]:
        return 1.1, "post-monsoon"
    else:
        return 0.9, "low-risk season"


def build_features(city: str, zone: str) -> dict:
    """Construct feature vector for the XGBoost model."""
    city_lower = city.lower().strip()
    zone_lower = zone.lower().strip()
    month = datetime.now().month

    profile = CITY_PROFILES.get(city_lower, CITY_PROFILES["mumbai"])
    zone_mod = ZONE_MODIFIERS.get(zone_lower, 1.0)

    is_monsoon = 1 if month in [6, 7, 8, 9] else 0
    is_summer = 1 if month in [4, 5] else 0
    is_winter = 1 if month in [11, 12, 1] else 0

    features = {
        "city_idx": CITY_INDEX.get(city_lower, 0),
        "month": month,
        "is_monsoon": is_monsoon,
        "is_summer": is_summer,
        "is_winter": is_winter,
        "avg_rainfall_mm": profile["rainfall"] * (1 + is_monsoon * 1.5),
        "flood_events_2yr": profile["floods"],
        "aqi_exceedances": profile["aqi"],
        "heatwave_days": profile["heat"] * is_summer,
        "platform_order_drop": 0.4 * is_monsoon + 0.15,
        "delivery_density": profile["density"],
        "zone_modifier": zone_mod,
        "disruption_freq_30d": 3 + is_monsoon * 4,
    }
    return features


def calculate_zone_risk(zone: str, city: str, pincode: str) -> dict:
    """
    Predict zone risk using real XGBoost model with SHAP explanations.
    Falls back to rule-based calculation if model isn't loaded.
    """
    city_lower = city.lower().strip()
    zone_lower = zone.lower().strip()
    season_mult, season_desc = get_season_multiplier()

    # Build feature vector
    features = build_features(city_lower, zone_lower)
    feature_values = np.array([[features[k] for k in _feature_names]]) if MODEL_LOADED else None

    if MODEL_LOADED and feature_values is not None:
        # ── Real XGBoost prediction ──
        risk_factor = float(_risk_model.predict(feature_values)[0])
        risk_factor = float(np.clip(risk_factor, 0.8, 2.5))
        risk_factor = round(risk_factor, 2)

        # ── Real SHAP explanations ──
        shap_values = _shap_explainer.shap_values(feature_values)
        shap_dict = {}
        shap_contributions = []
        for i, name in enumerate(_feature_names):
            sv = float(shap_values[0][i])
            shap_dict[name] = {
                "value": features[name],
                "shap": round(sv, 4),
                "direction": "increases" if sv > 0.02 else "decreases" if sv < -0.02 else "neutral",
            }
            shap_contributions.append((name, sv))

        # Sort by absolute SHAP impact for explanation
        shap_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        top_3 = shap_contributions[:3]

        explanation_parts = []
        for name, sv in top_3:
            readable = name.replace("_", " ")
            if abs(sv) > 0.02:
                direction = "↑" if sv > 0 else "↓"
                explanation_parts.append(f"{readable} {direction} ({sv:+.3f})")

        explanation = (
            f"Your zone ({zone}, {city}) has a risk factor of {risk_factor}. "
            f"Top SHAP contributors: {', '.join(explanation_parts) if explanation_parts else 'balanced risk'}. "
            f"Current season: {season_desc}."
        )

        return {
            "zone": zone,
            "city": city,
            "pincode": pincode,
            "riskFactor": risk_factor,
            "seasonMultiplier": season_mult,
            "seasonDescription": season_desc,
            "features": shap_dict,
            "explanation": explanation,
            "model": "XGBoost v2.0 (trained, SHAP-explained)",
            "modelLoaded": True,
        }

    else:
        # ── Fallback: rule-based ──
        profile = CITY_PROFILES.get(city_lower, CITY_PROFILES["mumbai"])
        zone_mod = ZONE_MODIFIERS.get(zone_lower, 1.0)
        risk_factor = 1.2 * zone_mod
        month = datetime.now().month
        if month in [6, 7, 8, 9]:
            risk_factor += 0.4
        elif month in [4, 5]:
            risk_factor += 0.2
        risk_factor = round(float(np.clip(risk_factor, 0.8, 2.5)), 2)

        return {
            "zone": zone,
            "city": city,
            "pincode": pincode,
            "riskFactor": risk_factor,
            "seasonMultiplier": season_mult,
            "seasonDescription": season_desc,
            "features": {},
            "explanation": f"Risk factor {risk_factor} (fallback mode — run train_models.py to enable AI).",
            "model": "Rule-based fallback (model not loaded)",
            "modelLoaded": False,
        }

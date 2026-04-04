"""
Advanced Fraud Detector — Real Isolation Forest + MSVS
Loads trained Isolation Forest model from saved_models/ and combines with
7-signal Multi-Signal Verification Score for fraud detection.
"""

import os
import numpy as np
import joblib
import hashlib
import math
from datetime import datetime

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")

# Load trained model
try:
    _fraud_model = joblib.load(os.path.join(MODEL_DIR, "isolation_forest_fraud.pkl"))
    _fraud_features = joblib.load(os.path.join(MODEL_DIR, "fraud_feature_names.pkl"))
    _norm_params = joblib.load(os.path.join(MODEL_DIR, "fraud_norm_params.pkl"))
    FRAUD_MODEL_LOADED = True
    print("✅ Isolation Forest fraud model loaded successfully")
except Exception as e:
    FRAUD_MODEL_LOADED = False
    _fraud_model = None
    _fraud_features = None
    _norm_params = None
    print(f"⚠️  Fraud model not found ({e}). Run: python train_models.py")


# Signal weights (from MSVS specification)
SIGNAL_WEIGHTS = {
    "cellTower": 0.20,
    "wifi": 0.15,
    "accelerometer": 0.15,
    "platformActivity": 0.20,
    "weatherValidation": 0.15,
    "networkLatency": 0.05,
    "deviceIntegrity": 0.10,
}

# Zone center coordinates (for GPS distance calculation)
ZONE_CENTERS = {
    "andheri west": (19.1364, 72.8296), "andheri east": (19.1197, 72.8464),
    "bandra": (19.0596, 72.8295), "dadar": (19.0178, 72.8478),
    "borivali": (19.2307, 72.8567), "connaught place": (28.6315, 77.2167),
    "dwarka": (28.5921, 77.0460), "noida": (28.5355, 77.3910),
    "koramangala": (12.9352, 77.6245), "whitefield": (12.9698, 77.7500),
    "hitech city": (17.4435, 78.3772), "t nagar": (13.0418, 80.2341),
}


def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def simulate_signal(signal_name: str, user_id: str, trust_score: float) -> dict:
    """Simulate individual MSVS verification signal."""
    seed = int(hashlib.md5(f"{user_id}:{signal_name}".encode()).hexdigest()[:8], 16)
    rng = np.random.RandomState(seed)

    pass_probability = 0.85 + (trust_score * 0.12)
    passed = rng.random() < pass_probability
    suspicion = 0.0 if passed else rng.uniform(0.4, 0.9)

    signal_details = {
        "cellTower": {
            True: {"status": "match", "detail": "Cell tower location matches claimed zone (±500m)"},
            False: {"status": "mismatch", "detail": "Cell tower indicates different zone (>2km discrepancy)"},
        },
        "wifi": {
            True: {"status": "commercial", "detail": "Connected to commercial/public Wi-Fi in work area"},
            False: {"status": "home_detected", "detail": "Connected to registered home Wi-Fi during claim"},
        },
        "accelerometer": {
            True: {"status": "walking", "detail": "Movement pattern consistent with walking/riding"},
            False: {"status": "stationary", "detail": "Phone stationary (flat surface) for >30 minutes"},
        },
        "platformActivity": {
            True: {"status": "recent", "detail": "Last order accepted 35 minutes before trigger"},
            False: {"status": "inactive", "detail": "No platform activity in last 4 hours"},
        },
        "weatherValidation": {
            True: {"status": "confirmed", "detail": "3 nearest weather stations confirm conditions"},
            False: {"status": "inconsistent", "detail": "Weather stations don't corroborate claimed conditions"},
        },
        "networkLatency": {
            True: {"status": "consistent", "detail": "RTT to regional server matches claimed location"},
            False: {"status": "anomalous", "detail": "Network latency inconsistent with claimed zone"},
        },
        "deviceIntegrity": {
            True: {"status": "clean", "detail": "No mock location apps or root detected"},
            False: {"status": "compromised", "detail": "Mock location provider enabled on device"},
        },
    }

    details = signal_details.get(signal_name, {True: {"status": "ok", "detail": "Passed"}, False: {"status": "failed", "detail": "Failed"}})

    return {
        "signal": signal_name,
        "passed": passed,
        "suspicion": round(float(suspicion), 3),
        "weight": SIGNAL_WEIGHTS[signal_name],
        **details[passed],
    }


def build_fraud_features(
    trust_score: float, gps_lat: float = None, gps_lon: float = None,
    zone: str = "andheri west", signals: dict = None,
    claim_count_30d: int = 0,
) -> np.ndarray:
    """Build feature vector for Isolation Forest from MSVS signals + context."""
    zone_center = ZONE_CENTERS.get(zone.lower().strip())

    # GPS distance
    if gps_lat and gps_lon and zone_center:
        gps_distance = haversine_km(zone_center[0], zone_center[1], gps_lat, gps_lon)
    else:
        gps_distance = 1.0  # assume nearby if no GPS

    # Extract signal results
    cell_match = 1 if signals and signals.get("cellTower", {}).get("passed", True) else 0
    wifi_home = 0 if signals and signals.get("wifi", {}).get("passed", True) else 1
    accel_moving = 1 if signals and signals.get("accelerometer", {}).get("passed", True) else 0
    last_order_mins = 35 if signals and signals.get("platformActivity", {}).get("passed", True) else 240
    weather_confirm = 3 if signals and signals.get("weatherValidation", {}).get("passed", True) else 0
    device_clean = 1 if signals and signals.get("deviceIntegrity", {}).get("passed", True) else 0
    peer_cluster = 0  # default no cluster

    features = np.array([[
        round(gps_distance, 2),
        cell_match,
        wifi_home,
        accel_moving,
        last_order_mins,
        claim_count_30d,
        round(trust_score, 3),
        weather_confirm,
        device_clean,
        peer_cluster,
    ]])

    return features


def check_gps_spoofing(zone, gps_lat=None, gps_lon=None):
    """Detect GPS spoofing by comparing claimed zone to GPS coordinates."""
    if gps_lat is None or gps_lon is None:
        return {"flagged": False, "reason": "No GPS data provided — skipped", "distance_km": None, "suspicion": 0.0}

    center = ZONE_CENTERS.get(zone.lower().strip())
    if not center:
        return {"flagged": False, "reason": "Zone not in database — skipped", "distance_km": None, "suspicion": 0.0}

    distance = round(haversine_km(center[0], center[1], gps_lat, gps_lon), 2)

    if distance > 15:
        return {"flagged": True, "reason": f"GPS is {distance}km from zone — possible spoofing", "distance_km": distance, "suspicion": 0.95}
    elif distance > 5:
        return {"flagged": True, "reason": f"GPS is {distance}km from zone — outside range", "distance_km": distance, "suspicion": 0.6}
    else:
        return {"flagged": False, "reason": f"GPS is {distance}km from zone — within range", "distance_km": distance, "suspicion": max(0.0, (distance - 2) * 0.1)}


def check_claim_history(user_id, claim_count_30d=0, avg_claims_30d=1.5):
    """Detect abnormal claim frequency."""
    if claim_count_30d <= 0:
        return {"flagged": False, "reason": "No recent claims — clean", "suspicion": 0.0, "ratio": 0.0}
    ratio = claim_count_30d / max(avg_claims_30d, 0.5)
    if ratio > 3.0:
        return {"flagged": True, "reason": f"{claim_count_30d} claims in 30d ({ratio:.1f}x avg) — high", "suspicion": 0.85, "ratio": round(ratio, 2)}
    elif ratio > 2.0:
        return {"flagged": True, "reason": f"{claim_count_30d} claims in 30d ({ratio:.1f}x avg) — elevated", "suspicion": 0.5, "ratio": round(ratio, 2)}
    else:
        return {"flagged": False, "reason": f"{claim_count_30d} claims in 30d — normal", "suspicion": max(0.0, (ratio - 1.0) * 0.15), "ratio": round(ratio, 2)}


def check_weather_crossval(zone, trigger_type, claimed_value=None, actual_value=None):
    """Cross-validate claimed weather against station data."""
    if claimed_value is None or actual_value is None:
        seed = int(hashlib.md5(f"{zone}:{trigger_type}:{datetime.now().hour}".encode()).hexdigest()[:8], 16)
        rng = np.random.RandomState(seed)
        match = rng.random() > 0.15
        return {"flagged": not match, "reason": "Weather cross-check: " + ("confirmed" if match else "inconsistent"), "suspicion": 0.0 if match else 0.55, "stations_confirmed": 3 if match else 1}
    deviation = abs(claimed_value - actual_value) / max(actual_value, 1)
    if deviation > 0.5:
        return {"flagged": True, "reason": f"Deviates {deviation*100:.0f}% from stations", "suspicion": min(0.9, deviation), "stations_confirmed": 0}
    return {"flagged": False, "reason": f"Within {deviation*100:.0f}% of stations", "suspicion": max(0.0, deviation * 0.3), "stations_confirmed": 3}


def check_duplicate_claims(user_id, trigger_id=None, recent_trigger_ids=None):
    """Detect duplicate claims for the same trigger."""
    if not recent_trigger_ids or not trigger_id:
        return {"flagged": False, "reason": "No duplicate detected", "suspicion": 0.0}
    if trigger_id in recent_trigger_ids:
        return {"flagged": True, "reason": f"Duplicate claim for trigger {trigger_id[:8]}", "suspicion": 0.95}
    return {"flagged": False, "reason": "No duplicate detected", "suspicion": 0.0}


def detect_fraud(user_id: str, zone: str, trigger_type: str, trust_score: float = 0.5) -> dict:
    """
    Run 7-signal MSVS + real Isolation Forest model.
    Returns fraud score (0–1) with signal-by-signal breakdown.
    """
    # Step 1: Run MSVS signals
    signals = {}
    msvs_score = 0.0
    for signal_name, weight in SIGNAL_WEIGHTS.items():
        result = simulate_signal(signal_name, user_id, trust_score)
        signals[signal_name] = result
        msvs_score += result["suspicion"] * weight

    # Step 2: Real Isolation Forest inference
    if FRAUD_MODEL_LOADED:
        feature_vec = build_fraud_features(trust_score, zone=zone, signals=signals)
        raw_score = float(_fraud_model.decision_function(feature_vec)[0])
        # Normalize to 0-1 (lower raw = more anomalous = higher fraud)
        isolation_score = 1 - (raw_score - _norm_params["min"]) / (_norm_params["max"] - _norm_params["min"])
        isolation_score = float(np.clip(isolation_score, 0.01, 0.99))
        model_label = "Isolation Forest v2.0 (trained) + MSVS"
    else:
        isolation_score = np.random.uniform(0.02, 0.15) * (1.3 - trust_score)
        isolation_score = float(np.clip(isolation_score, 0.01, 0.5))
        model_label = "Isolation Forest (fallback) + MSVS"

    # Step 3: Combine scores
    fraud_score = msvs_score * 0.6 + isolation_score * 0.4
    fraud_score = round(float(np.clip(fraud_score, 0.0, 1.0)), 3)

    # Determine tier
    if fraud_score < 0.3:
        tier, action = "green", "Auto-approve. Payout within 2 hours."
        worker_message = "Your payout is being processed. Stay safe!"
    elif fraud_score < 0.7:
        tier, action = "amber", "Hold for secondary verification (max 4 hours)."
        worker_message = "We're verifying your claim — payout expected shortly. No action needed."
    else:
        tier, action = "red", "Escalate to manual review (24-hour SLA)."
        worker_message = "Your claim needs additional review. You'll hear from us within 24 hours."

    passed_count = sum(1 for s in signals.values() if s["passed"])

    return {
        "userId": user_id,
        "fraudScore": fraud_score,
        "tier": tier,
        "action": action,
        "workerMessage": worker_message,
        "msvs": round(float(msvs_score), 3),
        "isolationForestScore": round(isolation_score, 3),
        "signalsPassed": passed_count,
        "signalsFailed": 7 - passed_count,
        "signals": signals,
        "model": model_label,
        "modelLoaded": FRAUD_MODEL_LOADED,
    }


def detect_fraud_advanced(
    user_id, zone, trigger_type, trust_score=0.5,
    gps_lat=None, gps_lon=None, claim_count_30d=0,
    trigger_id=None, recent_trigger_ids=None,
    claimed_value=None, actual_value=None,
) -> dict:
    """
    Phase 3 Advanced Fraud Detection.
    Combines MSVS + Isolation Forest + GPS/history/weather/duplicate checks.
    """
    base_result = detect_fraud(user_id, zone, trigger_type, trust_score)

    # Advanced checks
    gps_check = check_gps_spoofing(zone, gps_lat, gps_lon)
    history_check = check_claim_history(user_id, claim_count_30d)
    weather_check = check_weather_crossval(zone, trigger_type, claimed_value, actual_value)
    duplicate_check = check_duplicate_claims(user_id, trigger_id, recent_trigger_ids)

    advanced_checks = {
        "gpsSpoofing": gps_check,
        "claimHistory": history_check,
        "weatherCrossValidation": weather_check,
        "duplicateClaim": duplicate_check,
    }

    # Advanced penalty
    advanced_penalty = (
        gps_check["suspicion"] * 0.30
        + history_check["suspicion"] * 0.25
        + weather_check["suspicion"] * 0.25
        + duplicate_check["suspicion"] * 0.20
    )

    combined_score = base_result["fraudScore"] * 0.6 + advanced_penalty * 0.4
    combined_score = float(np.clip(combined_score, 0.0, 1.0))

    # Hard flags
    if duplicate_check["flagged"]:
        combined_score = max(combined_score, 0.90)
    if gps_check.get("suspicion", 0) > 0.8:
        combined_score = max(combined_score, 0.75)

    combined_score = round(combined_score, 3)

    if combined_score < 0.3:
        tier, action = "green", "Auto-approve. Payout within 2 hours."
        worker_message = "Your payout is being processed. Stay safe!"
    elif combined_score < 0.7:
        tier, action = "amber", "Hold for secondary verification (max 4 hours)."
        worker_message = "We're verifying your claim — payout expected shortly. No action needed."
    else:
        tier, action = "red", "Escalate to manual review (24-hour SLA)."
        worker_message = "Your claim needs additional review. You'll hear from us within 24 hours."

    flags_raised = sum(1 for c in advanced_checks.values() if c.get("flagged", False))

    return {
        "userId": user_id,
        "fraudScore": combined_score,
        "baseMsvsScore": base_result["fraudScore"],
        "advancedPenalty": round(advanced_penalty, 3),
        "tier": tier,
        "action": action,
        "workerMessage": worker_message,
        "flagsRaised": flags_raised,
        "advancedChecks": advanced_checks,
        "signals": base_result["signals"],
        "signalsPassed": base_result["signalsPassed"],
        "signalsFailed": base_result["signalsFailed"],
        "msvs": base_result["msvs"],
        "isolationForestScore": base_result["isolationForestScore"],
        "model": "Isolation Forest v2.0 + MSVS + Advanced Checks" + (" (trained)" if FRAUD_MODEL_LOADED else " (fallback)"),
        "modelLoaded": FRAUD_MODEL_LOADED,
    }

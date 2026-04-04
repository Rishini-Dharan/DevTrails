"""
GigShield Model Training Pipeline
Generates synthetic historical data, trains real XGBoost + Isolation Forest models,
computes SHAP values, and saves everything to disk.

Run: python train_models.py
Output: saved_models/ directory with .pkl files + SHAP plots
"""

import os
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, classification_report
import shap
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

SAVE_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVE_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════
# 1. RISK SCORER — XGBoost Regression
#    Input: zone weather/disruption features
#    Output: Zone Risk Factor (0.8 – 2.5)
# ═══════════════════════════════════════════════════════════

def generate_risk_data(n_samples=5000):
    """Generate synthetic historical zone-disruption data for Indian cities."""
    np.random.seed(42)

    cities = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "pune", "kolkata"]
    city_base_risk = {
        "mumbai": 1.6, "delhi": 1.4, "bangalore": 1.1,
        "hyderabad": 1.2, "chennai": 1.5, "pune": 1.15, "kolkata": 1.3,
    }

    rows = []
    for _ in range(n_samples):
        city = np.random.choice(cities)
        month = np.random.randint(1, 13)

        # Monsoon features (Jun-Sep are monsoon months)
        is_monsoon = 1 if month in [6, 7, 8, 9] else 0
        is_summer = 1 if month in [4, 5] else 0
        is_winter = 1 if month in [11, 12, 1] else 0

        # City-dependent weather features
        avg_rainfall_mm = np.random.uniform(5, 120) * (1 + is_monsoon * 1.5)
        if city in ["mumbai", "chennai", "kolkata"]:
            avg_rainfall_mm *= 1.3

        flood_events_2yr = np.random.poisson(3 if city in ["mumbai", "chennai"] else 1)
        aqi_exceedances = np.random.poisson(8 if city == "delhi" else 2)
        heatwave_days = np.random.poisson(10 if city == "delhi" else 4) * is_summer
        platform_order_drop = np.random.uniform(0.1, 0.8) * (is_monsoon * 0.6 + 0.2)
        delivery_density = np.random.uniform(200, 1200)
        zone_modifier = np.random.uniform(0.85, 1.2)
        disruption_freq_30d = np.random.poisson(2 + is_monsoon * 3)

        # Target: risk factor influenced by features
        risk = (
            city_base_risk[city] * 0.4
            + avg_rainfall_mm * 0.005
            + flood_events_2yr * 0.08
            + aqi_exceedances * 0.02
            + heatwave_days * 0.015
            + platform_order_drop * 0.3
            + disruption_freq_30d * 0.04
            + zone_modifier * 0.3
            + np.random.normal(0, 0.08)  # noise
        )
        risk = np.clip(risk, 0.8, 2.5)

        rows.append({
            "city_idx": cities.index(city),
            "month": month,
            "is_monsoon": is_monsoon,
            "is_summer": is_summer,
            "is_winter": is_winter,
            "avg_rainfall_mm": round(avg_rainfall_mm, 1),
            "flood_events_2yr": flood_events_2yr,
            "aqi_exceedances": aqi_exceedances,
            "heatwave_days": heatwave_days,
            "platform_order_drop": round(platform_order_drop, 3),
            "delivery_density": round(delivery_density, 0),
            "zone_modifier": round(zone_modifier, 3),
            "disruption_freq_30d": disruption_freq_30d,
            "risk_factor": round(risk, 3),
        })

    return pd.DataFrame(rows)


def train_risk_model():
    """Train XGBoost regressor for zone risk scoring."""
    print("\n══════════════════════════════════════")
    print("  Training XGBoost Risk Scorer")
    print("══════════════════════════════════════")

    df = generate_risk_data(5000)
    feature_cols = [c for c in df.columns if c != "risk_factor"]
    X = df[feature_cols]
    y = df["risk_factor"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective="reg:squarederror",
    )
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"  ✅ RMSE: {rmse:.4f}")
    print(f"  ✅ Samples: {len(df)} | Features: {len(feature_cols)}")

    # Save model
    model_path = os.path.join(SAVE_DIR, "xgb_risk_scorer.pkl")
    joblib.dump(model, model_path)
    print(f"  ✅ Model saved: {model_path}")

    # Save feature names
    joblib.dump(feature_cols, os.path.join(SAVE_DIR, "risk_feature_names.pkl"))

    # SHAP explainability
    print("  ⏳ Computing SHAP values...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test.iloc[:200])

    # Save SHAP summary plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_test.iloc[:200], show=False)
    plt.tight_layout()
    shap_path = os.path.join(SAVE_DIR, "shap_risk_summary.png")
    plt.savefig(shap_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"  ✅ SHAP plot saved: {shap_path}")

    # Save explainer for runtime use
    joblib.dump(explainer, os.path.join(SAVE_DIR, "shap_risk_explainer.pkl"))
    print("  ✅ SHAP explainer saved")

    return model, explainer


# ═══════════════════════════════════════════════════════════
# 2. FRAUD DETECTOR — Isolation Forest
#    Input: claim signal features
#    Output: fraud_score (0–1), anomaly label
# ═══════════════════════════════════════════════════════════

def generate_fraud_data(n_samples=3000):
    """Generate synthetic claim data — 90% legitimate, 10% fraudulent."""
    np.random.seed(42)

    rows = []
    for i in range(n_samples):
        is_fraud = np.random.random() < 0.10  # 10% fraud rate

        if is_fraud:
            # Fraudulent patterns
            gps_distance_km = np.random.uniform(5, 30)       # far from zone
            cell_tower_match = np.random.choice([0, 1], p=[0.7, 0.3])  # usually no match
            wifi_home = np.random.choice([1, 0], p=[0.6, 0.4])         # often on home wifi
            accelerometer_moving = np.random.choice([0, 1], p=[0.7, 0.3])  # usually stationary
            last_order_mins = np.random.uniform(120, 600)     # no recent orders
            claim_count_30d = np.random.poisson(5)            # high claim frequency
            trust_score = np.random.uniform(0.1, 0.5)         # low trust
            weather_stations_confirm = np.random.choice([0, 1, 2, 3], p=[0.4, 0.3, 0.2, 0.1])
            device_integrity = np.random.choice([0, 1], p=[0.5, 0.5])  # often compromised
            peer_cluster_flag = np.random.choice([1, 0], p=[0.4, 0.6])
        else:
            # Legitimate patterns
            gps_distance_km = np.random.uniform(0, 3)         # within zone
            cell_tower_match = np.random.choice([1, 0], p=[0.92, 0.08])
            wifi_home = np.random.choice([0, 1], p=[0.85, 0.15])
            accelerometer_moving = np.random.choice([1, 0], p=[0.88, 0.12])
            last_order_mins = np.random.uniform(5, 90)
            claim_count_30d = np.random.poisson(1)
            trust_score = np.random.uniform(0.4, 0.95)
            weather_stations_confirm = np.random.choice([2, 3], p=[0.3, 0.7])
            device_integrity = np.random.choice([1, 0], p=[0.95, 0.05])
            peer_cluster_flag = 0

        rows.append({
            "gps_distance_km": round(gps_distance_km, 2),
            "cell_tower_match": cell_tower_match,
            "wifi_home": wifi_home,
            "accelerometer_moving": accelerometer_moving,
            "last_order_mins": round(last_order_mins, 1),
            "claim_count_30d": claim_count_30d,
            "trust_score": round(trust_score, 3),
            "weather_stations_confirm": weather_stations_confirm,
            "device_integrity": device_integrity,
            "peer_cluster_flag": peer_cluster_flag,
            "is_fraud": int(is_fraud),
        })

    return pd.DataFrame(rows)


def train_fraud_model():
    """Train Isolation Forest for anomaly-based fraud detection."""
    print("\n══════════════════════════════════════")
    print("  Training Isolation Forest Fraud Detector")
    print("══════════════════════════════════════")

    df = generate_fraud_data(3000)
    feature_cols = [c for c in df.columns if c != "is_fraud"]
    X = df[feature_cols]
    y_true = df["is_fraud"]

    model = IsolationForest(
        n_estimators=200,
        contamination=0.10,
        max_samples=256,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X)

    # Isolation Forest returns -1 for anomalies, 1 for normal
    raw_scores = model.decision_function(X)
    predictions = model.predict(X)

    # Convert to 0-1 fraud score (lower decision score = more anomalous = higher fraud)
    fraud_scores = 1 - (raw_scores - raw_scores.min()) / (raw_scores.max() - raw_scores.min())

    # Evaluate against known labels
    pred_labels = (predictions == -1).astype(int)
    print(f"  ✅ Samples: {len(df)} | Fraud rate: {y_true.mean()*100:.1f}%")
    print(f"  ✅ Detected anomalies: {pred_labels.sum()} / {len(df)}")
    print(f"\n{classification_report(y_true, pred_labels, target_names=['Legit', 'Fraud'])}")

    # Save model
    model_path = os.path.join(SAVE_DIR, "isolation_forest_fraud.pkl")
    joblib.dump(model, model_path)
    print(f"  ✅ Model saved: {model_path}")

    # Save feature names
    joblib.dump(feature_cols, os.path.join(SAVE_DIR, "fraud_feature_names.pkl"))

    # Save score normalization params
    norm_params = {"min": float(raw_scores.min()), "max": float(raw_scores.max())}
    joblib.dump(norm_params, os.path.join(SAVE_DIR, "fraud_norm_params.pkl"))
    print(f"  ✅ Normalization params saved")

    return model


# ═══════════════════════════════════════════════════════════
# MAIN — Train everything
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("🛡️  GigShield ML Training Pipeline")
    print("=" * 50)

    risk_model, shap_explainer = train_risk_model()
    fraud_model = train_fraud_model()

    print("\n" + "=" * 50)
    print("✅ ALL MODELS TRAINED AND SAVED")
    print(f"📁 Output directory: {SAVE_DIR}")
    print("=" * 50)

    # List saved files
    for f in sorted(os.listdir(SAVE_DIR)):
        size = os.path.getsize(os.path.join(SAVE_DIR, f))
        print(f"   {f:40s} {size/1024:.1f} KB")

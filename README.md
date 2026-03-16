<p align="center">
  <img src="https://img.shields.io/badge/GigShield-AI%20Powered%20Insurance-blueviolet?style=for-the-badge&logo=shield" alt="GigShield Banner"/>
</p>

<h1 align="center">🛡️ GigShield — AI-Powered Parametric Insurance for India's Gig Economy</h1>

<p align="center">
  <em>Protecting the livelihoods of India's delivery partners against uncontrollable external disruptions — one week at a time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web%20App%20(PWA)-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Persona-Food%20Delivery%20Partners-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Pricing-Weekly%20Premium-green?style=flat-square" />
  <img src="https://img.shields.io/badge/AI%2FML-Powered-red?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Phase%201-yellow?style=flat-square" />
</p>

---

## 📑 Table of Contents

1.  [Executive Summary](#-executive-summary)
2.  [The Problem](#-the-problem)
3.  [Our Solution — GigShield](#-our-solution--gigshield)
4.  [Target Persona & Scenarios](#-target-persona--scenarios)
5.  [Application Workflow](#-application-workflow)
6.  [Weekly Premium Model](#-weekly-premium-model)
7.  [Parametric Triggers](#-parametric-triggers)
8.  [Platform Choice — Web (PWA)](#-platform-choice--web-pwa)
9.  [AI/ML Integration Plan](#-aiml-integration-plan)
10. [Tech Stack](#-tech-stack)
11. [Development Plan (6-Week Roadmap)](#-development-plan-6-week-roadmap)
12. [System Architecture](#-system-architecture)
13. [Key Differentiators](#-key-differentiators)
14. [Demo Video](#-demo-video)

---

## 🔍 Executive Summary

**GigShield** is an AI-powered parametric micro-insurance platform purpose-built for **food delivery partners** (Zomato, Swiggy) in India. It protects their **income** — not their health or vehicles — against **uncontrollable external disruptions** such as extreme weather, severe pollution, localised curfews, and platform outages.

The platform uses **real-time environmental data**, **AI-driven risk models**, and **parametric automation** to calculate fair weekly premiums, detect disruptions as they happen, and trigger **instant, zero-claim payouts** — all without requiring the worker to file a single form.

> **Core Principle:** If a delivery partner cannot earn due to forces beyond their control, GigShield pays them automatically.

---

## 🚨 The Problem

India has **7.7 million+** active gig workers, with food delivery being the largest segment. These workers face a harsh reality:

| Challenge | Impact |
|---|---|
| 🌧️ Heavy monsoon rains halt deliveries for hours/days | **20–30% monthly income loss** |
| 🌡️ Extreme heat (45°C+) makes outdoor work dangerous | Orders drop, workers forced off-road |
| 🌫️ Severe AQI (400+) in North India during winters | Reduced working hours, health risk |
| 🚫 Sudden curfews, bandhs, local strikes | Complete work stoppage in affected zones |
| 📱 Platform app outages or zone closures | No orders = No income |

**Current state:** Zero financial safety nets. No insurance product exists that covers pure income loss for gig workers on a weekly cycle. Traditional insurance is annual, slow, claim-heavy, and designed for salaried employees — not a ₹500/week delivery partner.

---

## 💡 Our Solution — GigShield

GigShield is a **micro-insurance product** that:

- ✅ **Covers income loss only** (strictly no health/life/accident/vehicle coverage)
- ✅ **Charges premiums weekly** (₹29–₹99/week, aligned with gig payout cycles)
- ✅ **Triggers payouts automatically** via real-time parametric data (no manual claims)
- ✅ **Uses AI/ML** for dynamic pricing, fraud detection, and risk profiling
- ✅ **Requires zero paperwork** — fully digital onboarding in under 3 minutes

---

## 👤 Target Persona & Scenarios

### Primary Persona: **Food Delivery Partner**

| Attribute | Details |
|---|---|
| **Name** | Ramesh Kumar (representative persona) |
| **Age** | 22–35 years |
| **Location** | Tier-1 / Tier-2 Indian city (Delhi NCR, Mumbai, Bangalore, Hyderabad) |
| **Platform** | Zomato / Swiggy |
| **Weekly Earnings** | ₹3,000 – ₹6,000 |
| **Working Hours** | 8–12 hours/day, 6 days/week |
| **Smartphone** | Entry-level Android, 4G connectivity |
| **Insurance Literacy** | Very low — never purchased any insurance digitally |
| **Financial Goal** | Stable weekly income to support family |

### Persona-Based Scenarios

#### 🌧️ Scenario 1 — Monsoon Disruption (Environmental)
> **Ramesh** is a Swiggy delivery partner in Mumbai. During the July monsoon, heavy rainfall (>65mm in 3 hours) causes waterlogging in his zone. The platform suspends deliveries for 14 hours across 2 days.
>
> **Without GigShield:** Ramesh loses ₹800–₹1,200 in potential earnings. He has no recourse.
>
> **With GigShield:** The system detects rainfall data from IMD/OpenWeather APIs exceeding the parametric threshold. A trigger fires automatically. Ramesh receives ₹750 directly in his UPI-linked wallet within 2 hours — **without filing any claim.**

#### 🌡️ Scenario 2 — Extreme Heat Wave (Environmental)
> **Priya** delivers for Zomato in Delhi during a May heatwave. Temperatures exceed 46°C. The platform issues an advisory reducing active delivery hours to avoid heat-related distress. Priya can only work 4 hours instead of her usual 10.
>
> **Without GigShield:** She earns ₹600 instead of ₹1,500 that day.
>
> **With GigShield:** The temperature trigger (>44°C sustained for 4+ hours) activates. A partial payout of ₹550 is processed covering 60% of her estimated lost income for the reduced-hour day.

#### 🚫 Scenario 3 — Local Bandh / Curfew (Social)
> **Arun** is a Zomato partner in Bangalore. A sudden 12-hour bandh is called in his operating zone. All deliveries are suspended.
>
> **Without GigShield:** Full day's income (~₹1,000) lost.
>
> **With GigShield:** The system ingests local news/government APIs and cross-references with platform activity data (order volume drops to near zero in the zone). The social disruption trigger fires, and Arun receives ₹800 payout.

#### 🌫️ Scenario 4 — Severe Air Pollution (Environmental)
> **Sunil** delivers in Delhi NCR during November. AQI crosses 450 (Severe+ category). Delivery volumes plummet as customers and platforms reduce activity.
>
> **Without GigShield:** Sunil earns 40% less for the entire week.
>
> **With GigShield:** The AQI trigger (>400 sustained for 6+ hours) is activated. A weekly supplemental payout covers 50% of the estimated income deficit.

---

## 🔄 Application Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GigShield — End-to-End Flow                        │
└─────────────────────────────────────────────────────────────────────────────┘

1. ONBOARDING (< 3 mins)
   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Phone +  │───▶│ Verify Gig  │───▶│ Select Work  │──▶│ AI Risk      │
   │ OTP Login│    │ Platform ID  │    │ Zone (City/  │    │ Profiling    │
   │          │    │ (Zomato/     │    │ Pincode)     │    │ (Instant)    │
   └──────────┘    │ Swiggy)      │    └──────────────┘    └──────────────┘
                   └──────────────┘

2. POLICY PURCHASE
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ View Weekly  │──▶│ Choose Plan  │───▶│ Pay via UPI  │
   │ Premium      │    │ (Basic /     │    │ / Wallet     │
   │ (AI-priced)  │    │ Standard /   │    │              │
   │              │    │ Premium)     │    │              │
   └──────────────┘    └──────────────┘    └──────────────┘

3. ACTIVE COVERAGE (Automated — No User Action Required)
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Real-Time    │───▶│ Parametric   │───▶│ AI Fraud    │
   │ Monitoring   │    │ Trigger      │    │ Check        │
   │ (Weather,    │    │ Detected!    │    │ (< 30 sec)   │
   │ AQI, News)   │    │              │    │              │
   └──────────────┘    └──────────────┘    └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ AUTO PAYOUT  │
                                          │ via UPI      │
                                          │ (< 2 hours)  │
                                          └──────────────┘

4. DASHBOARD & INSIGHTS
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ View Active  │    │ Payout       │    │ Risk & Zone  │
   │ Policy &     │    │ History      │    │ Analytics    │
   │ Coverage     │    │              │    │              │
   └──────────────┘    └──────────────┘    └──────────────┘
```

### Detailed Workflow Steps

| Step | Action | Actor | Details |
|---|---|---|---|
| 1 | **Sign Up** | Worker | Phone + OTP. No email or Aadhaar needed initially. |
| 2 | **Link Gig Profile** | Worker | Enter Zomato/Swiggy partner ID (simulated verification). |
| 3 | **Select Work Zone** | Worker | Pick city + primary delivery pincode/area. |
| 4 | **AI Risk Profiling** | System | Model scores risk based on zone's weather history, disruption frequency, and historical platform data. |
| 5 | **View & Buy Policy** | Worker | See weekly premium (dynamic). Choose plan tier. Pay via UPI/wallet. |
| 6 | **Coverage Active** | System | Real-time monitoring begins for the purchased week. |
| 7 | **Trigger Detection** | System | Parametric thresholds breached → auto-claim initiated. |
| 8 | **Fraud Validation** | System | AI checks legitimacy (location, timing, pattern analysis). |
| 9 | **Instant Payout** | System | Approved amount credited to worker's UPI ID. |
| 10 | **Renewal Nudge** | System | Weekly reminder to renew. Premium may adjust based on updated risk. |

---

## 💰 Weekly Premium Model

### Why Weekly?
Gig workers are paid weekly by platforms. An annual or monthly premium creates a cash-flow mismatch. **Weekly premiums** ensure:
- **Affordability:** Small, digestible amounts (₹29–₹99/week).
- **Flexibility:** Workers can opt-in/out weekly based on earnings.
- **Alignment:** Premium and coverage match the platform's payout cycle.

### Premium Tiers

| Plan | Weekly Premium | Coverage Limit (per week) | Disruption Types Covered | Target Worker |
|---|---|---|---|---|
| **Basic** | ₹29 | Up to ₹1,500 | Weather only (rain, heat) | Low-hour / part-time workers |
| **Standard** | ₹59 | Up to ₹3,000 | Weather + AQI + Platform outages | Regular full-time workers |
| **Premium** | ₹99 | Up to ₹5,000 | All disruptions (weather, AQI, social, platform) | High-earning power workers |

### Premium Calculation Formula

```
Weekly Premium = Base Rate × Zone Risk Factor × Season Multiplier × Claim History Modifier

Where:
  Base Rate            = ₹15 (industry-actuarial baseline for micro-parametric products)
  Zone Risk Factor     = 0.8 – 2.5 (ML-derived; based on zone's historical disruption density)
  Season Multiplier    = 0.9 – 1.8 (monsoon, winter smog, summer heat peaks)
  Claim History Mod.   = 0.85 – 1.3 (rewards no-claim weeks; flags high-frequency claimants)
```

### Payout Calculation

```
Payout Amount = Estimated Daily Income × Disruption Hours / Standard Working Hours × Coverage %

Where:
  Estimated Daily Income   = Derived from platform earning data (self-declared + validated)
  Disruption Hours         = Hours the parametric trigger was active in the worker's zone
  Standard Working Hours   = 10 hours (industry average for food delivery)
  Coverage %               = 50–80% (varies by plan tier: Basic=50%, Standard=65%, Premium=80%)
```

### Financial Viability

| Metric | Value |
|---|---|
| Average Premium ARPU | ₹59/worker/week |
| Expected Loss Ratio | 55–65% (parametric = lower admin overhead) |
| Fraud Savings (AI) | ~12% reduction vs. traditional claims |
| Break-even Scale | ~50,000 active weekly policies |
| Revenue Model | Premium income + data insights licensing (anonymised, aggregated) |

---

## ⚡ Parametric Triggers

Parametric insurance eliminates the need for manual claim filing. Payouts are triggered **automatically** when pre-defined, independently verifiable conditions are met.

### Trigger Definitions

| Trigger ID | Disruption Type | Parameter | Threshold | Data Source | Payout Level |
|---|---|---|---|---|---|
| `TRG-RAIN` | Heavy Rainfall | Precipitation (mm/hr) | > 30 mm/hr sustained for 2+ hours | OpenWeatherMap / IMD API | Proportional to duration |
| `TRG-FLOOD` | Urban Flooding | Water level + road closure reports | Flood alert issued by local authority | IMD + News API | Full daily income |
| `TRG-HEAT` | Extreme Heat | Temperature (°C) | > 44°C for 4+ consecutive hours | OpenWeatherMap API | 60% of daily income |
| `TRG-AQI` | Severe Pollution | AQI Index | > 400 (Severe+) for 6+ hours | CPCB / AQICN API | 50% of weekly deficit |
| `TRG-CURFEW` | Curfew / Bandh | Government order / news validation | Official announcement + platform activity drop >80% | News API + Platform data (sim.) | Full daily income |
| `TRG-STRIKE` | Local Strike | Zone-level activity anomaly | Order volume drops >70% in zone for 4+ hours | Platform API (simulated) | Proportional |
| `TRG-PLATFORM` | Platform Outage | App availability / error rates | Platform confirmed outage >2 hours | Platform status API (simulated) | Proportional |

### Trigger Evaluation Pipeline

```
Real-Time Data Ingestion (every 15 min)
          │
          ▼
┌─────────────────────┐
│  Data Normalisation │──── Weather, AQI, News, Platform feeds
│  & Validation       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Threshold Engine   │──── Compare against trigger rules per zone
│                     │
└─────────┬───────────┘
          │  Threshold breached?
          ▼
┌─────────────────────┐
│  Geo-Fence Match    │──── Is the worker's zone affected?
│                     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Fraud Detection AI │──── Anomaly scoring, duplicate check
│                     │
└─────────┬───────────┘
          │  Score < Fraud Threshold?
          ▼
┌─────────────────────┐
│  Payout Calculation │──── Apply formula based on plan & disruption
│  & Disbursement     │
└─────────────────────┘
```

---

## 🌐 Platform Choice — Web (PWA)

### Decision: **Progressive Web App (PWA)** over Native Mobile App

| Criterion | Web (PWA) ✅ | Native Mobile ❌ |
|---|---|---|
| **Device Compatibility** | Works on any browser — Android, iOS, desktop | Requires separate Android + iOS builds |
| **Install Friction** | No app store download needed; "Add to Home Screen" | Requires Play Store / App Store install |
| **Storage** | < 5 MB vs. 50–100 MB for native app | Gig workers have storage-constrained phones |
| **Updates** | Instant — no user action needed | Requires manual app update |
| **Development Speed** | Single codebase, faster iteration | 2x effort for dual platforms |
| **Offline Support** | Service workers enable offline-first design | Native handles offline natively |
| **Push Notifications** | Supported via Web Push API | Supported |
| **Cost** | 60% lower development cost | High — dual platform + store fees |

### Why PWA is Ideal for Gig Workers

1. **Low-end devices:** Most delivery partners use budget Android phones with 32–64 GB storage. A lightweight PWA respects their constraints.
2. **Low data usage:** PWAs are designed for efficient data transfer — critical for workers on prepaid data plans.
3. **No digital literacy barrier:** No app store navigation. A simple WhatsApp/SMS link opens the PWA directly.
4. **Rapid onboarding:** Shareable URL means onboarding via a QR code at a hub or a WhatsApp message.

---

## 🤖 AI/ML Integration Plan

AI/ML is embedded across **four critical pillars** of the GigShield platform:

### 1. 🎯 AI-Powered Dynamic Premium Calculation

| Component | Details |
|---|---|
| **Model** | Gradient Boosted Trees (XGBoost) for risk scoring |
| **Input Features** | Zone weather history (5 yrs), disruption frequency, seasonal patterns, worker's claim history, platform density in zone |
| **Output** | `Zone Risk Factor` (0.8–2.5) used in premium formula |
| **Training Data** | Historical weather data (IMD), AQI data (CPCB), city-level disruption records |
| **Retraining** | Weekly batch retraining with latest disruption data |
| **Explainability** | SHAP values shown to workers — *"Your premium is ₹49 this week because monsoon activity in your zone is moderate."* |

### 2. 🛡️ Intelligent Fraud Detection

| Component | Details |
|---|---|
| **Model** | Isolation Forest (anomaly detection) + Rule-based engine |
| **Detection Vectors** | |
| — Location Spoofing | Cross-reference claimed zone with GPS pings during disruption window |
| — Duplicate Claims | Same disruption event → same worker → multiple claim attempts |
| — Earning Inflation | Declared earnings significantly exceed platform average for that zone/tier |
| — Collusion Patterns | Graph analysis detecting clusters of suspicious claims from linked accounts |
| **Outcome** | Each claim gets a `fraud_score` (0–1). Score > 0.7 → manual review. Score > 0.9 → auto-reject with appeal option. |
| **Accuracy Target** | < 2% false positive rate (to avoid blocking legitimate payouts) |

### 3. 📊 Predictive Risk Modelling

| Component | Details |
|---|---|
| **Model** | LSTM (Long Short-Term Memory) network for time-series disruption forecasting |
| **Purpose** | Predict disruption likelihood for the upcoming week per zone |
| **Usage** | Proactive premium adjustment, advance notifications to workers, reserve allocation |
| **Input** | 30-day rolling weather forecasts, seasonal trends, historical disruption timelines |
| **Output** | `Disruption Probability Score` per zone per day (0–1) |

### 4. 🧠 Smart Onboarding & Personalisation

| Component | Details |
|---|---|
| **NLP Chatbot** | Vernacular support (Hindi, Kannada, Tamil, Telugu) for onboarding assistance |
| **Recommendation Engine** | Suggests optimal plan tier based on worker's declared earnings and zone risk |
| **Churn Prediction** | Identifies workers likely to drop off next week; triggers retention nudges |

### AI/ML Pipeline Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Data Layer  │────▶│  Feature     │────▶│  Model       │
│              │     │  Store       │     │  Training    │
│ - Weather API│     │              │     │  (Weekly)    │
│ - AQI API    │     │ - Zone stats │     │              │
│ - Platform   │     │ - Worker     │     │ - XGBoost    │
│   data       │     │   profiles   │     │ - Isolation  │
│ - News feeds │     │ - Claim      │     │   Forest     │
│              │     │   history    │     │ - LSTM       │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  Inference   │
                                          │  Service     │
                                          │ (Real-time)  │
                                          │              │
                                          │ - Premium    │
                                          │   scoring    │
                                          │ - Fraud      │
                                          │   detection  │
                                          │ - Trigger    │
                                          │   evaluation │
                                          └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js** | UI framework for the PWA |
| **Next.js** | Server-side rendering, routing, API routes |
| **Tailwind CSS** | Rapid, responsive styling |
| **PWA (Service Workers)** | Offline support, push notifications, installability |
| **Chart.js / Recharts** | Analytics dashboard visualizations |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Python (FastAPI)** | ML model serving & data pipelines |
| **PostgreSQL** | Primary relational database (policies, users, payouts) |
| **Redis** | Caching (API responses, session management, rate limiting) |
| **Apache Kafka** | Event streaming for real-time trigger processing |

### AI/ML
| Technology | Purpose |
|---|---|
| **Scikit-learn** | Isolation Forest for fraud detection |
| **XGBoost** | Risk scoring and premium calculation model |
| **TensorFlow/Keras** | LSTM model for disruption forecasting |
| **MLflow** | Model versioning, experiment tracking |
| **SHAP** | Model explainability for transparent premium justification |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| **Docker** | Containerisation for all services |
| **AWS / GCP** | Cloud hosting (ECS/Cloud Run for services, S3 for assets) |
| **GitHub Actions** | CI/CD pipeline |
| **Nginx** | Reverse proxy and load balancer |
| **Prometheus + Grafana** | System monitoring and alerting |

### External APIs & Integrations
| API | Purpose | Mode |
|---|---|---|
| **OpenWeatherMap API** | Real-time weather data | Free tier |
| **AQICN / CPCB API** | Air quality index data | Free / Mock |
| **NewsAPI / GDELT** | Local disruption news monitoring | Free tier / Mock |
| **Razorpay / PayU** | UPI payment processing | Sandbox |
| **Twilio / MSG91** | OTP and push notifications | Trial |
| **Mapbox / Google Maps** | Geo-fencing and zone mapping | Free tier |

---

## 📅 Development Plan (6-Week Roadmap)

### Week 1 — Ideation & Foundation
| Task | Deliverable |
|---|---|
| Finalise persona (Food Delivery — Swiggy/Zomato) | Persona document |
| Define all parametric triggers with thresholds | Trigger specification sheet |
| Design weekly premium model with actuarial assumptions | Premium model document |
| Set up Git repo, CI/CD, project scaffolding | Repository + pipeline |
| Create comprehensive README | ✅ **This document** |
| Record 2-min strategy video | Video link |

### Week 2 — Core Backend + Data Layer
| Task | Deliverable |
|---|---|
| Design database schema (users, policies, triggers, payouts) | ERD + migrations |
| Build REST APIs: Auth, Onboarding, Policy CRUD | API endpoints |
| Integrate Weather + AQI APIs (free tier) | Live data ingestion |
| Set up Kafka event stream for trigger monitoring | Event pipeline |

### Week 3 — AI/ML Models (v1)
| Task | Deliverable |
|---|---|
| Train XGBoost risk model on historical weather data | Risk scoring service |
| Build Isolation Forest fraud detection model | Fraud detection service |
| Implement premium calculation engine | Dynamic pricing API |
| Create feature store with zone-level aggregations | Feature pipeline |

### Week 4 — Frontend + User Flows
| Task | Deliverable |
|---|---|
| Build PWA: Onboarding, Plan Selection, Dashboard | Working frontend |
| Implement UPI payment flow (Razorpay sandbox) | Payment integration |
| Build worker dashboard (policy status, payout history) | Dashboard UI |
| Build admin analytics dashboard | Admin panel |

### Week 5 — Parametric Engine + Integration
| Task | Deliverable |
|---|---|
| Implement real-time trigger evaluation engine | Auto-claim system |
| Connect trigger engine → fraud check → payout pipeline | End-to-end flow |
| LSTM disruption forecasting model (v1) | Predictive alerts |
| Load testing and performance optimisation | Performance benchmarks |

### Week 6 — Polish, Test & Demo
| Task | Deliverable |
|---|---|
| End-to-end testing (happy path + edge cases) | Test reports |
| UI/UX polish and accessibility improvements | Final UI |
| Prepare demo scenario walkthroughs | Demo scripts |
| Final presentation and documentation | Presentation deck |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (PWA - React/Next.js)                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │
│  │ Onboarding│  │  Policy   │  │ Dashboard │  │  Admin    │        │
│  │   Flow    │  │ Purchase  │  │ (Worker)  │  │ Analytics │        │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS / REST
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Nginx)                              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Auth & User    │ │  Policy &    │ │  ML Inference    │
│  Service        │ │  Payout      │ │  Service         │
│  (Node.js)      │ │  Service     │ │  (FastAPI/Python) │
│                 │ │  (Node.js)   │ │                  │
│  - OTP Auth     │ │  - CRUD      │ │  - Premium Calc  │
│  - Profile Mgmt │ │  - Payments  │ │  - Fraud Score   │
│                 │ │  - History   │ │  - Risk Profile  │
└────────┬────────┘ └──────┬───────┘ └────────┬─────────┘
         │                 │                   │
         └────────┬────────┘                   │
                  ▼                            │
         ┌──────────────┐              ┌───────┴────────┐
         │  PostgreSQL  │              │  Model Store   │
         │  (Primary DB)│              │  (MLflow)      │
         └──────────────┘              └────────────────┘
                  │
                  │
┌─────────────────┴───────────────────────────────────────────────────┐
│                    EVENT LAYER (Apache Kafka)                        │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │ Weather Events│  │  AQI Events   │  │  News Events  │           │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘           │
│          └──────────────────┼──────────────────┘                    │
│                             ▼                                       │
│                  ┌─────────────────────┐                            │
│                  │  Trigger Evaluation │                            │
│                  │  Engine             │                            │
│                  └──────────┬──────────┘                            │
│                             │                                       │
│                             ▼                                       │
│                  ┌─────────────────────┐                            │
│                  │  Payout Processor   │──── Razorpay UPI Sandbox   │
│                  └─────────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏆 Key Differentiators

| Feature | GigShield | Traditional Insurance |
|---|---|---|
| **Target** | Gig delivery workers | Salaried employees |
| **Premium Cycle** | Weekly | Annual / Monthly |
| **Claim Process** | Zero-touch parametric | Manual form + documents + weeks of processing |
| **Payout Speed** | < 2 hours (automated) | 15–60 days |
| **AI Integration** | Core (pricing, fraud, prediction) | Bolt-on (if any) |
| **Coverage** | Income loss only | Bundled (health + life + asset) |
| **Onboarding** | 3 minutes, phone only | Branch visit, KYC documents |
| **Affordability** | ₹29–₹99/week | ₹5,000–₹20,000/year |

---

## 🎥 Demo Video

> 📹 **2-Minute Strategy & Prototype Video:** *[Link to be added upon recording]*
>
> The video covers:
> - Problem statement and market opportunity
> - GigShield's core value proposition
> - Live prototype walkthrough (Onboarding → Policy Purchase → Trigger → Payout)
> - Tech architecture overview
> - 6-week execution roadmap

---

## 📂 Repository Structure (Planned)

```
guidewire/
├── README.md                   # This document
├── client/                     # React/Next.js PWA frontend
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Next.js pages (onboarding, dashboard, admin)
│   ├── public/                 # Static assets, PWA manifest
│   └── styles/                 # Tailwind CSS configurations
├── server/                     # Node.js + Express backend
│   ├── routes/                 # API route handlers
│   ├── models/                 # Database models (Sequelize/Prisma)
│   ├── services/               # Business logic (policy, payout, trigger)
│   ├── middleware/              # Auth, validation, rate limiting
│   └── config/                 # Environment configs
├── ml/                         # Python ML services
│   ├── models/                 # Trained models (XGBoost, Isolation Forest, LSTM)
│   ├── training/               # Training scripts and notebooks
│   ├── inference/              # FastAPI inference server
│   └── data/                   # Training data and feature pipelines
├── triggers/                   # Parametric trigger evaluation engine
│   ├── consumers/              # Kafka consumers for each data source
│   ├── evaluator/              # Threshold evaluation logic
│   └── dispatcher/             # Payout dispatch and notification
├── docker-compose.yml          # Local development environment
├── .github/workflows/          # CI/CD pipeline
└── docs/                       # Additional documentation
    ├── api-spec.yaml           # OpenAPI specification
    ├── erd.png                 # Database schema diagram
    └── architecture.png        # System architecture diagram
```

---

## 👥 Team

| Role | Responsibility |
|---|---|
| **Full-Stack Developer** | Frontend PWA + Backend APIs |
| **ML Engineer** | Risk models, fraud detection, forecasting |
| **Product/Domain Lead** | Insurance domain logic, premium modelling, trigger design |

---

## 📜 License

This project is developed as part of the **Guidewire Hackathon** challenge for AI-Powered Insurance for India's Gig Economy.

---

<p align="center">
  <strong>GigShield</strong> — Because every delivery partner deserves a safety net. 🛡️
</p>

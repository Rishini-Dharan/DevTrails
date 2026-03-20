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
14. [Adversarial Defense & Anti-Spoofing Strategy](#-adversarial-defense--anti-spoofing-strategy)
15. [Demo Video](#-demo-video)

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

### Deep Persona Insights — Why Ramesh Thinks the Way He Does

Understanding Ramesh's **financial psychology** and **technology behaviour** is the foundation of every design choice in GigShield:

#### 💭 Financial Psychology & Trust Barriers

| Insight | GigShield Design Response |
|---|---|
| **Weekly mental accounting** — Ramesh budgets day-to-day: ₹200 for fuel, ₹150 for meals, ₹100 saved. He does not think in monthly or annual terms. | Premium is weekly, displayed as *"less than the cost of one chai per day"* (₹29 = ₹4.14/day). |
| **Deep distrust of "insurance"** — Ramesh's uncle filed a health claim and waited 45 days for a partial rejection. The word *bima* triggers suspicion. | We brand as *"income protection"*, not insurance. Zero paperwork. Payout lands before the disruption is over. Every cleared payout builds brand trust via WhatsApp share: *"GigShield paid me ₹750 in 90 minutes during the storm."* |
| **Loss aversion over gain seeking** — Ramesh won't pay for something "just in case." He'll pay to **stop losing** what he already earns. | Framing: *"Don't let the rain steal ₹1,200 from your pocket this week"* — not *"Earn peace of mind."* |
| **Peer validation drives adoption** — Ramesh trusts his rider WhatsApp group more than any ad or app store listing. | Built-in referral: after every successful payout, worker gets a pre-filled WhatsApp message: *"I just got ₹750 from GigShield. Try it."* Referral gives both workers one free week. |
| **Cash-flow fragility** — Missing even ₹500 in a week can cascade: he borrows from an informal lender at 5% weekly interest, creating a debt trap. | Payout lands within 2 hours of trigger — fast enough to prevent the debt spiral from starting. |

#### 📱 Technology Behaviour

- **WhatsApp-first world:** Ramesh uses WhatsApp for everything — family, rider groups, payment screenshots. GigShield's onboarding link, payout notifications, and renewal nudges all flow through WhatsApp (via official API), the one channel he checks 50+ times/day.
- **App fatigue:** He has Swiggy/Zomato partner app, Google Maps, PhonePe, and WhatsApp. Storage is maxed. A PWA that needs no install and works via a browser link removes the #1 adoption barrier.
- **Low English literacy:** All UI is vernacular-first (Hindi, Kannada, Tamil, Telugu). No jargon. Icons over text. Voice tooltips explain premium breakdowns in the worker's language.
- **Trust in screenshots:** Ramesh screenshots everything — UPI confirmations, earnings summaries. GigShield generates a shareable "payout receipt" card (with amount, reason, and timestamp) designed to look good in a WhatsApp forward.

#### 🗺️ Pain-Point → Feature Mapping

| Ramesh's Pain Point | Emotional Impact | GigShield Feature |
|---|---|---|
| *"I lost 2 days of work to rain and nobody cared"* | Helplessness, anger | Parametric auto-trigger: system detects the rain, files the "claim" on Ramesh's behalf |
| *"I don't understand insurance forms"* | Confusion, avoidance | Zero paperwork. Zero forms. Payout is fully automated. |
| *"What if they don't pay?"* | Distrust | First-payout-guarantee: if a trigger fires in your first covered week, payout is guaranteed (capped at Basic tier) regardless of fraud score. Builds trust through experience. |
| *"I can't afford ₹5,000 upfront"* | Financial exclusion | ₹29/week, paid via UPI — same flow as sending ₹30 to a friend. |
| *"The app doesn't work on my phone"* | Tech frustration | PWA: runs in Chrome, < 5MB, works offline, no Play Store needed. |
| *"I don't know what I'm paying for"* | Opacity | SHAP-powered explainability: *"Your ₹49 premium covers: ₹32 for monsoon risk (heavy rain expected this week) + ₹12 for AQI risk + ₹5 platform fee."* |

#### 📖 Journey of a Worst-Case Week — Ramesh in Mumbai, July

> **Monday:** The week starts normally. Ramesh pays his ₹59 Standard premium via UPI. Coverage activates instantly.
>
> **Tuesday 2:00 PM:** IMD issues an orange alert — 80mm rainfall expected across Mumbai's western suburbs. GigShield's weather pipeline ingests the alert. No trigger yet (forecast ≠ trigger).
>
> **Tuesday 6:00 PM:** Rainfall exceeds 65mm in Ramesh's pincode (Andheri West) for 3 consecutive hours. **TRG-RAIN fires.** The system simultaneously:
> 1. Calculates Ramesh's estimated lost income for the disruption window (6 PM – 11 PM = 5 hours → ₹750 lost).
> 2. Runs the fraud detection model: Ramesh's phone is in Andheri (GPS + cell tower confirmed), he accepted his last Swiggy order at 5:42 PM before the rain hit, and his accelerometer shows walking movement at 6:15 PM (seeking shelter). **Fraud score: 0.08 (clean).**
> 3. Pushes ₹490 (65% coverage at Standard tier) to Ramesh's UPI at 7:45 PM — **1 hour 45 minutes after trigger.**
>
> **Wednesday:** Rain continues. A second trigger window (10 AM – 4 PM) fires. Another ₹585 is deposited. Ramesh shares his payout screenshot in his rider WhatsApp group. Three riders ask for the GigShield link.
>
> **Thursday:** BMC reports waterlogging and road closures in Andheri. **TRG-FLOOD fires** (more severe tier). Ramesh gets ₹975 (full daily income estimate at 65% coverage). Total payouts this week: **₹2,050** against a ₹59 premium.
>
> **Friday–Sunday:** Weather clears. Ramesh works normally. The premium he paid covered 3 real disruption events that would have otherwise cost him > ₹2,000.
>
> **Next Monday:** GigShield's renewal nudge arrives via WhatsApp: *"Last week we protected ₹2,050 of your income. Renew for ₹59?"* Ramesh renews in one tap.

---

## 🔄 Application Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GigShield — End-to-End Flow                        │
└─────────────────────────────────────────────────────────────────────────────┘

1. ONBOARDING (< 3 mins)
   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Phone +  │───▶│ Verify Gig   │───▶│ Select Work  │───▶│ AI Risk      │
   │ OTP Login│    │ Platform ID  │    │ Zone (City/  │    │ Profiling    │
   │          │    │ (Zomato/     │    │ Pincode)     │    │ (Instant)    │
   └──────────┘    │ Swiggy)      │    └──────────────┘    └──────────────┘
                   └──────────────┘

2. POLICY PURCHASE
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ View Weekly  │───▶│ Choose Plan  │───▶│ Pay via UPI  │
   │ Premium      │    │ (Basic /     │    │ / Wallet     │
   │ (AI-priced)  │    │ Standard /   │    │              │
   │              │    │ Premium)     │    │              │
   └──────────────┘    └──────────────┘    └──────────────┘

3. ACTIVE COVERAGE (Automated — No User Action Required)
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Real-Time    │───▶│ Parametric   │───▶│ AI Fraud     │
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
│  Data Normalisation  │──── Weather, AQI, News, Platform feeds
│  & Validation        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Threshold Engine    │──── Compare against trigger rules per zone
│                      │
└─────────┬───────────┘
          │  Threshold breached?
          ▼
┌─────────────────────┐
│  Geo-Fence Match     │──── Is the worker's zone affected?
│                      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Fraud Detection AI  │──── Anomaly scoring, duplicate check
│                      │
└─────────┬───────────┘
          │  Score < Fraud Threshold?
          ▼
┌─────────────────────┐
│  Payout Calculation  │──── Apply formula based on plan & disruption
│  & Disbursement      │
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

### 🔬 How Our AI Actually Works — End-to-End Walkthrough

To move beyond a feature list, here is the **exact sequence of operations** when a disruption strikes. We trace a single rain event from raw data to UPI payout:

```
Step 1 │ DATA INGESTION (T+0 min)
       │ Kafka consumer pulls OpenWeatherMap data every 15 min.
       │ Payload: { "zone": "MUM-ANW-400058", "precip_mm_hr": 72, "temp_c": 27, "ts": "..." }
       │
Step 2 │ FEATURE EXTRACTION (T+1 min)
       │ Feature store enriches raw data with zone context:
       │   - rolling_precip_3hr: 182mm (sum of last 3 readings)
       │   - historical_avg_precip_july: 45mm/hr
       │   - active_policies_in_zone: 342
       │   - zone_disruption_freq_30d: 4 events
       │
Step 3 │ THRESHOLD ENGINE (T+1 min)
       │ Rule TRG-RAIN: precip > 30mm/hr sustained 2+ hrs → TRUE
       │ rolling_precip_3hr (182mm) >> threshold → TRIGGER FIRES
       │
Step 4 │ GEO-FENCE MATCHING (T+2 min)
       │ Query: which active policies have zone = MUM-ANW-400058?
       │ Result: 342 workers with active Standard/Premium policies.
       │
Step 5 │ FRAUD DETECTION — per worker (T+3 min)
       │ For each of the 342 workers, Isolation Forest scores:
       │   Input features:
       │     - gps_in_zone: YES (cell tower triangulation confirms)
       │     - last_order_accepted: 42 min ago (consistent with pre-rain activity)
       │     - accelerometer_pattern: "walking" (not stationary)
       │     - wifi_bssid: commercial area (not home network)
       │     - claim_frequency_30d: 1 (low)
       │     - peer_cluster_flag: FALSE
       │   Output: fraud_score = 0.08 → GREEN (auto-approve)
       │
Step 6 │ PAYOUT CALCULATION (T+4 min)
       │ Ramesh (Standard plan, 65% coverage):
       │   estimated_daily_income = ₹1,500
       │   disruption_hours = 5 (6 PM – 11 PM)
       │   payout = ₹1,500 × (5/10) × 0.65 = ₹487.50 → rounded to ₹490
       │
Step 7 │ DISBURSEMENT (T+90 min)
       │ Razorpay UPI payout API → Ramesh's UPI ID → ₹490 credited
       │ WhatsApp notification: "₹490 deposited. Reason: Heavy rain in your zone."
```

**Total time: data ingestion to money in wallet = ~90 minutes.** No human involvement. No form. No call centre.

#### Worked Example — XGBoost Zone Risk Factor

The "Zone Risk Factor" is not a black box. Here is how the XGBoost model derives it for a specific zone:

| Feature | Value for MUM-ANW-400058 (Andheri West, Mumbai) | Weight (SHAP) |
|---|---|---|
| Avg. monsoon rainfall (July) | 85 mm/hr (high) | +0.42 |
| Flood events in last 2 years | 7 | +0.31 |
| Road waterlogging frequency | 12 incidents/monsoon | +0.18 |
| Platform order drop during past disruptions | -68% avg. | +0.15 |
| AQI exceedances (>400) per year | 2 (low — Mumbai has lower AQI issues) | -0.08 |
| Active delivery partners in zone | 890 (high density) | -0.05 |
| **Predicted Zone Risk Factor** | **1.85** (high risk) | |

This means a worker in Andheri West pays: `₹15 × 1.85 × Season × ClaimHistory` = higher premium during monsoon, lower outside monsoon. The SHAP breakdown is shown to the worker in simple language: *"Your zone has heavy monsoon history — that's the main reason for your premium this week."*

#### Worked Example — Isolation Forest Anomaly Detection

**Legitimate claim (Ramesh):**
- GPS: Andheri West ✅ | Cell tower: Andheri West ✅ | Wi-Fi: commercial/unknown ✅
- Last Swiggy order: 42 min ago (pre-rain) ✅ | Accelerometer: walking pattern ✅
- Claim frequency: 1 in 30 days ✅ | Peer cluster: none ✅
- **Isolation Forest path length: long (normal) → fraud_score: 0.08 → AUTO-APPROVE**

**Spoofed claim (Bad Actor):**
- GPS: Andheri West ❌ Cell tower: Thane (15 km away) ❌ | Wi-Fi: home BSSID (registered address in Thane) ❌
- Last Swiggy order: 6 hours ago (no pre-rain activity) ❌ | Accelerometer: stationary for 3 hours ❌
- Claim frequency: 4 in 30 days ⚠️ | Peer cluster: 12 workers with same pattern ❌
- **Isolation Forest path length: short (anomaly) → fraud_score: 0.92 → AUTO-REJECT + APPEAL OPTION**

### 🔄 Model Lifecycle — From Training to Production

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GigShield ML Model Lifecycle                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. INITIAL TRAINING (Pre-Launch)
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Historical   │───▶│ Feature      │───▶│ Train v1     │
   │ Weather Data │    │ Engineering  │    │ Models       │
   │ (IMD 5-yr)   │    │ (zone-level  │    │ (XGBoost,    │
   │ + AQI (CPCB) │    │ aggregation) │    │ IsoForest,   │
   │ + Simulated  │    │              │    │ LSTM)        │
   │ claim data   │    │              │    │              │
   └──────────────┘    └──────────────┘    └──────────────┘

2. WEEKLY RETRAINING (Automated)
   - Every Sunday midnight: batch job pulls the past week's real data
   - Retrain all three models on updated dataset
   - Evaluate against holdout set: accuracy, precision, recall, F1
   - If new model beats current champion on all metrics → auto-deploy
   - If not → keep champion, log challenger for review

3. CHAMPION / CHALLENGER DEPLOYMENT
   ┌──────────────┐    ┌──────────────┐
   │  Champion    │    │  Challenger  │
   │  (v2.3)      │    │  (v2.4)      │
   │  Serves 95%  │    │  Serves 5%   │
   │  of traffic  │    │  (shadow)    │
   └──────────────┘    └──────────────┘
         │                    │
         └────── Compare ─────┘
                   │
              If challenger wins
              on live metrics for
              2 consecutive weeks
                   │
                   ▼
          Promote to Champion

4. MONITORING & DRIFT DETECTION
   - Feature drift: if input distribution shifts >15% from training data → alert
   - Prediction drift: if fraud score distribution changes significantly → alert
   - Concept drift: if claim approval rate deviates >10% from expected → trigger manual review
   - All tracked via MLflow + Prometheus dashboards
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

### 🧩 Why This Stack — Architectural Justifications

A tech stack is not a shopping list. Every choice has a reason:

| Decision | Rationale |
|---|---|
| **Two runtimes (Node.js + FastAPI)** | Node.js handles high-concurrency I/O-bound API traffic (auth, policy CRUD, payments) where the event loop excels. FastAPI (Python) serves ML models natively — XGBoost, Scikit-learn, and TensorFlow all have first-class Python APIs. Forcing ML inference through Node.js would add serialization overhead and language bridge complexity. The two services communicate via REST internally, behind Nginx. |
| **Kafka over simple polling** | Polling weather APIs every 15 minutes across 500+ zones would mean 2,000+ HTTP calls/hour from a single service — fragile and rate-limit-prone. Kafka decouples ingestion from processing: one lightweight producer polls each API, publishes to topic partitions (keyed by zone), and multiple consumers process triggers in parallel. This also gives us **replay capability** — if the trigger engine crashes, we can reprocess from Kafka's log without data loss. |
| **PostgreSQL over NoSQL** | Insurance data is inherently relational: policies reference users, payouts reference policies and triggers, triggers reference zones. Strong consistency matters — we cannot have a payout record that references a non-existent policy. PostgreSQL's ACID compliance, JSON column support (for flexible trigger metadata), and mature tooling (Prisma ORM) make it the right choice. |
| **Redis for caching** | Weather API responses are identical for all workers in the same zone. Redis caches zone-level weather data with a 15-minute TTL, eliminating redundant external API calls. Also used for OTP session management (5-minute TTL) and API rate limiting. |
| **PWA over native** | See [Platform Choice](#-platform-choice--web-pwa). In short: gig workers have storage-constrained phones, low app literacy, and no patience for Play Store installs. A PWA served via a WhatsApp link removes every friction point. |
| **MLflow for model versioning** | With 3 models retraining weekly, we need experiment tracking, artifact storage, and production model registry. MLflow provides all three with a lightweight self-hosted server — no vendor lock-in. |

### 🌊 Data Flow Narrative — Life of a Weather Event

To tie the architecture together, here is how a single weather event flows through every layer:

```
 OpenWeatherMap API                    GigShield Platform
─────────────────────  ─────────────────────────────────────────────────────
                       
 [Weather Station]     Kafka Producer (Python cron, every 15 min)
       │                     │
       │  HTTP GET            │  Publish to topic: "weather-events"
       └─────────────────────▶│  Key: zone_id, Value: {precip, temp, ts}
                              │
                              ▼
                       ┌─────────────────┐
                       │  Apache Kafka   │  Topic: weather-events
                       │  Partition by   │  Retention: 7 days
                       │  zone_id        │
                       └────────┬────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
           Trigger Consumer          Analytics Consumer
           (Python/FastAPI)          (writes to PostgreSQL
                    │                 for dashboards)
                    │
                    ▼
           Threshold Engine: precip > 30mm/hr for 2+ hrs?
                    │ YES
                    ▼
           Query PostgreSQL: active policies in zone?
                    │ 342 policies
                    ▼
           Fraud Detection Service (FastAPI)
           ├── For each worker: compute fraud_score
           ├── GPS + Cell tower + Accelerometer + Wi-Fi check
           └── Isolation Forest inference (batch, < 3 sec for 342)
                    │
                    ▼
           Payout Calculator: apply formula per policy tier
                    │
                    ▼
           Razorpay UPI Payout API (sandbox) → worker's UPI ID
                    │
                    ▼
           WhatsApp Business API → payout notification
           PostgreSQL → log payout record
           Redis → invalidate zone cache
```

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

## 🚨 Adversarial Defense & Anti-Spoofing Strategy

> **Context:** A sophisticated syndicate of 500 delivery workers in a tier-1 city has exploited a beta parametric insurance platform by using GPS-spoofing apps to fake their locations in severe weather zones, triggering mass false payouts and draining the liquidity pool. Simple GPS verification is officially obsolete. GigShield's architecture is designed to be **spoof-proof from day one.**

### 1. 🎯 The Differentiation — Genuine Rider vs. Bad Actor

GPS is treated as **one signal among seven** in our verification matrix. No single signal can approve or reject a claim. The system uses a **Multi-Signal Verification Score (MSVS)** that fuses all signals into a single trust score:

| Signal | What It Detects | How It Works | Spoof Difficulty |
|---|---|---|---|
| **1. Cell-Tower Triangulation** | True approximate location, independent of GPS | Query carrier network for serving cell tower IDs. Compare tower location against claimed GPS zone. Discrepancy > 2 km = flag. | **Very hard** — requires physical proximity to towers; cannot be faked by an app. |
| **2. Wi-Fi BSSID Fingerprinting** | Whether the worker is at home vs. in the field | If the phone is connected to (or recently scanned) a Wi-Fi network matching their registered home address BSSID during the claim window → strong fraud signal. | **Hard** — attacker would need to disable Wi-Fi entirely, which itself is a signal. |
| **3. Accelerometer & Gyroscope Patterns** | Physical movement vs. stationary (phone on a table) | A genuinely stranded rider's phone shows micro-movement patterns (walking to shelter, shifting weight, handling the phone). A phone resting on a table at home shows flat-line accelerometer data. ML classifier trained on real movement data. | **Very hard** — would require physically shaking the phone continuously. |
| **4. Platform Activity Cross-Reference** | Recent delivery activity before the disruption | Query Zomato/Swiggy partner API (simulated): When was the last order accepted/completed? A genuine rider has activity 30–60 min before the disruption. A spoofer has no recent platform activity because they were never in the zone. | **Impossible to fake** — platform logs are server-side. |
| **5. Hyper-Local Weather Micro-Validation** | Whether the weather at the claimed location actually matches the trigger | Compare the worker's claimed GPS coordinates against the 3 nearest weather station readings. If stations report 2mm rain but the worker claims to be in a 70mm downpour → flag. | **Impossible to fake** — weather data is from independent government/3rd-party stations. |
| **6. Network Latency Fingerprinting** | Physical proximity to claimed location | Measure round-trip latency to known regional servers. A phone in Mumbai has ~5ms latency to Mumbai CDN edge. A phone in Thane spoofing Mumbai GPS would show ~15ms latency — detectable discrepancy. | **Hard** — requires VPN + latency masking, which introduces other detectable artifacts. |
| **7. Device Integrity Check** | Whether GPS-spoofing apps are installed/active | Detect mock location providers enabled in Android settings (standard API). Check for known GPS-spoofing app signatures (package names, running processes). Flag rooted/jailbroken devices with location mocking enabled. | **Moderate** — sophisticated users can hide this, but raises the fraud_score contribution. |

#### 🧮 Multi-Signal Verification Score (MSVS) Calculation

```
MSVS = Σ (signal_weight × signal_result) for all 7 signals

Where:
  signal_result  = 0 (consistent/clean) to 1 (suspicious/failed)
  signal_weight  = assigned by importance:
    Cell tower:          0.20
    Wi-Fi BSSID:         0.15
    Accelerometer:       0.15
    Platform activity:   0.20
    Weather validation:  0.15
    Network latency:     0.05
    Device integrity:    0.10

Final fraud_score = Isolation Forest anomaly score × 0.4 + MSVS × 0.6
```

**Key insight:** Even if a spoofer defeats GPS and device integrity checks, they **cannot simultaneously fake** cell tower location, Wi-Fi absence, accelerometer movement, platform order history, AND weather station agreement. Defeating 5+ independent signals simultaneously is operationally infeasible.

### 2. 📊 The Data — Detecting Coordinated Fraud Rings

Individual spoofing is a nuisance. **Organized syndicates** (500+ workers coordinating via Telegram) are an existential threat. GigShield detects coordinated attacks using data points far beyond GPS:

#### Ring Detection Signals

| Data Point | What It Reveals | Detection Method |
|---|---|---|
| **Registration clustering** | Workers recruited in bulk by syndicate organizers | Flag: >20 new registrations from same pincode within 48 hours. Cross-reference device fingerprints (IMEI, phone model + OS version patterns). |
| **Device fingerprint overlap** | Shared or factory-reset devices used to create multiple accounts | Track: IMEI, device model, OS build number, screen resolution, installed font list. Cluster accounts sharing ≥3 device attributes. |
| **UPI payout graph** | Money flowing to a small set of beneficiary accounts | Graph analysis: if 50 workers' payouts are routed to ≤5 unique UPI IDs → syndicate signal. Also detect cycle patterns (A pays B, B pays C, C pays A). |
| **Temporal claim synchronization** | 100+ claims from one zone within a 10-minute window when normal is 5–10 | Spike detection: claim volume per zone per 15-min window. Z-score > 3.0 compared to historical baseline → coordinated attack alert. |
| **Geographic impossibility** | Claims from suspiciously identical GPS coordinates | If >10 workers report GPS coordinates within a 50m radius (e.g., same apartment building) during a disruption → flag cluster. Genuine riders would be distributed across the zone. |
| **Adjacent zone comparison** | Affected zone shows abnormal claim rates vs. neighbors | If Zone A has 400% claim rate spike but adjacent Zones B, C, D (with similar weather) show normal rates → Zone A likely has organized fraud. |
| **Telecom tower clustering** | Mass onboarding via Telegram groups from same physical location | Monitor: sudden spike in new registrations where >50% of new users' phones connect to the same 2–3 cell towers → organized signup event. |
| **Behavioral velocity checks** | Physically impossible location transitions | Worker's GPS shows Zone A at 2:00 PM, Zone B (30 km away) at 2:20 PM → impossible travel speed → location manipulation. |

#### Syndicate Detection Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Syndicate Detection Pipeline                             │
└─────────────────────────────────────────────────────────────────────────────┘

  Real-Time Layer (every claim):                Batch Layer (daily):
  ┌─────────────────────┐                       ┌─────────────────────┐
  │ Individual MSVS     │                       │ Social Graph        │
  │ scoring (7 signals) │                       │ Analysis            │
  └─────────┬───────────┘                       │ (NetworkX /         │
            │                                   │  Neo4j)             │
            ▼                                   │                     │
  ┌─────────────────────┐                       │ - Registration      │
  │ Zone-Level Spike    │                       │   clusters          │
  │ Detection           │                       │ - UPI payout        │
  │ (Z-score > 3.0?)    │                       │   graph analysis    │
  └─────────┬───────────┘                       │ - Device finger-    │
            │                                   │   print clustering  │
            ▼                                   └──────────┬──────────┘
  ┌─────────────────────┐                                  │
  │ Adjacent Zone       │                                  │
  │ Comparison          │                                  │
  │ (claim rate ratio)  │                                  │
  └─────────┬───────────┘                                  │
            │                                              │
            └───────────────┬──────────────────────────────┘
                            ▼
                  ┌─────────────────────┐
                  │ Risk Aggregator     │
                  │                     │
                  │ If syndicate risk   │
                  │ > threshold:        │
                  │  → Freeze zone      │
                  │    payouts          │
                  │  → Alert ops team   │
                  │  → Escalate flagged │
                  │    accounts         │
                  └─────────────────────┘
```

### 3. ⚖️ The UX Balance — Fair Treatment of Flagged Claims

The worst outcome is not fraud — it's **punishing an honest worker during a genuine emergency.** A delivery partner stranded in a storm who gets their claim rejected will never trust the platform again. Our UX design prioritises **innocent until proven guilty:**

#### Tiered Response System (Not Binary Accept/Reject)

| Tier | Fraud Score | Action | Worker Experience | SLA |
|---|---|---|---|---|
| 🟢 **Green** | < 0.3 | **Auto-approve** | Payout hits UPI within 2 hours. Worker sees: *"₹490 deposited. Stay safe!"* | Instant |
| 🟡 **Amber** | 0.3 – 0.7 | **Hold + lightweight verification** | Payout held for max 4 hours. System runs secondary checks (see below). Worker sees: *"We're verifying your claim — payout expected by [time]. No action needed from you."* | ≤ 4 hours |
| 🔴 **Red** | > 0.7 | **Escalate to manual review** | Claim queued for human review. Worker sees: *"Your claim needs additional review. You'll hear from us within 24 hours. If this is an error, tap here to submit an appeal."* | ≤ 24 hours |

#### Amber-Tier Secondary Verification (Designed to be Non-Intrusive)

When a claim lands in Amber, the system tries to **resolve it automatically** before asking the worker for anything:

1. **Re-query cell tower data** — sometimes initial triangulation is noisy in bad weather. A second query 15 minutes later may confirm the worker's location.
2. **Check platform activity lag** — if the worker completed a delivery 45 minutes before the disruption but the API had a sync delay, the initial check may have missed it. Re-pull with expanded window.
3. **Cross-reference with peer data** — if 80% of other workers in the same zone are Green-approved, the Amber worker is likely genuine (weather is real, most riders are confirmed there).
4. **Only if automated checks don't resolve:** send a single, non-intrusive push notification: *"Quick verification: please tap to confirm your current location."* This re-requests location permission and captures a fresh GPS + cell tower reading. **No selfie. No form. One tap.**

If secondary verification passes → auto-release payout. If it fails → escalate to Red.

#### Appeal Mechanism

- **One-tap appeal** from the claim status screen.
- Worker can optionally upload a photo (e.g., waterlogged street outside) or a brief voice note.
- Appeals are reviewed within 24 hours. If overturned, payout is released **with a 10% goodwill bonus** for the inconvenience.
- **Appeal acceptance rate is tracked** — if the system's false-positive rate exceeds 2%, model retraining is auto-triggered.

#### Trust Score — Rewarding Honest Workers Over Time

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Worker Trust Score                            │
│                                                                      │
│  New Worker (Week 1):        trust_score = 0.5 (neutral)            │
│                                                                      │
│  Events that INCREASE trust:                                         │
│    +0.05  Each genuine claim approved (Green)                        │
│    +0.10  Appeal upheld (system was wrong, worker was right)         │
│    +0.02  Each active week with no claims (stable behaviour)         │
│    +0.03  Peer validation (workers nearby confirm conditions)        │
│                                                                      │
│  Events that DECREASE trust:                                         │
│    -0.15  Red-flagged claim confirmed as fraud                       │
│    -0.10  Device integrity check failed (spoofing app detected)      │
│    -0.05  Claim retracted by worker after challenge                  │
│                                                                      │
│  Trust Score Benefits:                                               │
│    ≥ 0.8  → "Trusted Rider" badge, all claims auto-Green            │
│    ≥ 0.6  → Standard processing, Amber threshold raised to 0.5      │
│    < 0.4  → Enhanced scrutiny, lower Amber threshold (0.2)          │
│    < 0.2  → Account review, potential suspension                     │
└──────────────────────────────────────────────────────────────────────┘
```

#### Transparency Guarantee

Every flagged claim shows the worker **exactly why** in simple language — no black-box rejections:

> *"Your claim was flagged because your phone's network location didn't match the affected zone. This can happen due to network issues in bad weather. We're verifying now — no action needed."*

> *"Your claim needs review because multiple claims came from your area at the same time. This is a routine check to keep the platform safe for all riders. Expected resolution: within 24 hours."*

This transparency is not optional — it is a **core design principle.** Workers who understand why a check is happening are 3x more likely to wait patiently vs. churning.

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

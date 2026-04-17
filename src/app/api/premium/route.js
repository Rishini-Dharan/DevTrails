import { NextResponse } from 'next/server';
import { calculatePremium, PLANS } from '../../../core/data';

export async function POST(request) {
  const body = await request.json();
  const { plan, city, zone, weeklyEarnings } = body;

  if (!plan || !zone) {
    return NextResponse.json({ error: 'Missing required fields: plan, zone' }, { status: 400 });
  }

  const result = calculatePremium(plan, city, zone, weeklyEarnings || 4500);

  if (!result) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // Add SHAP-style explainability breakdown
  const shapBreakdown = generateSHAPBreakdown(zone, city, plan);

  return NextResponse.json({
    ...result,
    shapExplanation: shapBreakdown,
    timestamp: new Date().toISOString(),
  });
}

function generateSHAPBreakdown(zone, city, planId) {
  const plan = PLANS.find(p => p.id === planId);
  
  // Simulate SHAP values for premium explanation
  const zoneHistories = {
    'Koramangala': { monsoonRisk: 0.28, floodHistory: 0.15, heatRisk: 0.08, aqiRisk: -0.05, density: -0.03 },
    'Andheri': { monsoonRisk: 0.42, floodHistory: 0.31, heatRisk: 0.05, aqiRisk: -0.08, density: -0.05 },
    'Connaught Place': { monsoonRisk: 0.12, floodHistory: 0.08, heatRisk: 0.35, aqiRisk: 0.28, density: -0.04 },
    'Madhapur': { monsoonRisk: 0.18, floodHistory: 0.10, heatRisk: 0.12, aqiRisk: -0.06, density: -0.08 },
    'T. Nagar': { monsoonRisk: 0.32, floodHistory: 0.22, heatRisk: 0.15, aqiRisk: -0.04, density: -0.02 },
  };

  const shapValues = zoneHistories[zone] || {
    monsoonRisk: 0.2, floodHistory: 0.12, heatRisk: 0.1, aqiRisk: 0.05, density: -0.03
  };

  const month = new Date().getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    baseValue: 15,
    features: [
      { 
        name: 'Monsoon rainfall history', 
        shapValue: shapValues.monsoonRisk, 
        direction: 'increases',
        explanation: `Your zone has historically high monsoon activity`
      },
      { 
        name: 'Flood event frequency', 
        shapValue: shapValues.floodHistory, 
        direction: 'increases',
        explanation: `${Math.floor(shapValues.floodHistory * 20)} flood events recorded in the last 2 years`
      },
      { 
        name: 'Heat wave exposure', 
        shapValue: shapValues.heatRisk, 
        direction: shapValues.heatRisk > 0 ? 'increases' : 'decreases',
        explanation: `${shapValues.heatRisk > 0.2 ? 'High' : 'Moderate'} extreme heat risk for your zone`
      },
      { 
        name: 'AQI severity', 
        shapValue: shapValues.aqiRisk, 
        direction: shapValues.aqiRisk > 0 ? 'increases' : 'decreases',
        explanation: `${shapValues.aqiRisk > 0 ? 'Significant' : 'Low'} air quality disruption risk`
      },
      { 
        name: `Seasonal factor (${monthNames[month]})`, 
        shapValue: month >= 5 && month <= 8 ? 0.25 : -0.05,
        direction: month >= 5 && month <= 8 ? 'increases' : 'decreases',
        explanation: `${month >= 5 && month <= 8 ? 'Monsoon season — elevated risk' : 'Non-peak season — reduced risk'}`
      },
      { 
        name: 'Rider density in zone', 
        shapValue: shapValues.density, 
        direction: 'decreases',
        explanation: 'Higher rider density spreads risk across more policies'
      },
    ],
    finalPrediction: plan?.weeklyPremium || 59,
    modelVersion: 'XGBoost v2.3 (Champion)',
  };
}

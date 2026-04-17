// Simulated data layer for the Lattice Protocol platform
// In production, these would be database queries and external API calls

export const CITIES = [
  { id: 'BLR', name: 'Bengaluru', state: 'Karnataka', zones: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'JP Nagar', 'Electronic City'] },
  { id: 'MUM', name: 'Mumbai', state: 'Maharashtra', zones: ['Andheri', 'Bandra', 'Powai', 'Dadar', 'Malad', 'Thane'] },
  { id: 'DEL', name: 'Delhi NCR', state: 'Delhi', zones: ['Connaught Place', 'Dwarka', 'Rohini', 'Saket', 'Noida', 'Gurgaon'] },
  { id: 'HYD', name: 'Hyderabad', state: 'Telangana', zones: ['Madhapur', 'Gachibowli', 'Banjara Hills', 'Kukatpally', 'Secunderabad', 'Ameerpet'] },
  { id: 'CHN', name: 'Chennai', state: 'Tamil Nadu', zones: ['T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'OMR', 'Porur'] },
];

export const PLANS = [
  {
    id: 'basic',
    name: 'Basic Shield',
    weeklyPremium: 29,
    coverageLimit: 1500,
    coveragePercent: 50,
    disruptions: ['Heavy Rainfall', 'Extreme Heat'],
    color: '#06b6d4',
    popular: false,
    features: [
      'Weather disruption coverage',
      'Up to ₹1,500/week payout',
      '50% income coverage',
      'Auto-trigger payouts',
      'Basic analytics',
    ]
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    weeklyPremium: 59,
    coverageLimit: 3000,
    coveragePercent: 65,
    disruptions: ['Heavy Rainfall', 'Extreme Heat', 'Severe AQI', 'Platform Outage'],
    color: '#6366f1',
    popular: true,
    features: [
      'All weather + AQI + platform outage',
      'Up to ₹3,000/week payout',
      '65% income coverage',
      'Auto-trigger payouts',
      'Detailed risk analytics',
      'Priority payout queue',
    ]
  },
  {
    id: 'premium',
    name: 'Premium Shield',
    weeklyPremium: 99,
    coverageLimit: 5000,
    coveragePercent: 80,
    disruptions: ['Heavy Rainfall', 'Extreme Heat', 'Severe AQI', 'Platform Outage', 'Curfew/Bandh', 'Local Strike'],
    color: '#10b981',
    popular: false,
    features: [
      'All disruption types covered',
      'Up to ₹5,000/week payout',
      '80% income coverage',
      'Auto-trigger payouts',
      'Full risk analytics + forecast',
      'Priority payout queue',
      'WhatsApp payout alerts',
    ]
  }
];

export const TRIGGER_TYPES = [
  { id: 'TRG-RAIN', name: 'Heavy Rainfall', icon: '🌧️', param: 'Precipitation', threshold: '> 30mm/hr for 2+ hrs', severity: 'high' },
  { id: 'TRG-FLOOD', name: 'Urban Flooding', icon: '🌊', param: 'Water Level', threshold: 'Flood alert issued', severity: 'critical' },
  { id: 'TRG-HEAT', name: 'Extreme Heat', icon: '🌡️', param: 'Temperature', threshold: '> 44°C for 4+ hrs', severity: 'high' },
  { id: 'TRG-AQI', name: 'Severe AQI', icon: '🌫️', param: 'AQI Index', threshold: '> 400 for 6+ hrs', severity: 'medium' },
  { id: 'TRG-CURFEW', name: 'Curfew / Bandh', icon: '🚫', param: 'Govt. Order', threshold: 'Official announcement', severity: 'critical' },
  { id: 'TRG-PLATFORM', name: 'Platform Outage', icon: '📱', param: 'App Status', threshold: 'Outage > 2 hrs', severity: 'medium' },
];

// Generate realistic mock data
export function generateMockUser() {
  return {
    id: 'USR-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    platform: 'Swiggy',
    platformId: 'SWG-' + Math.floor(Math.random() * 900000 + 100000),
    city: 'BLR',
    zone: 'Koramangala',
    weeklyEarnings: 4500,
    joinedDate: '2026-03-15',
    activePlan: 'standard',
    walletBalance: 1450,
    totalPayoutsReceived: 3250,
    claimHistory: [
      { id: 'CLM-001', date: '2026-04-10', trigger: 'TRG-RAIN', amount: 975, status: 'paid', fraudScore: 0.08 },
      { id: 'CLM-002', date: '2026-04-07', trigger: 'TRG-AQI', amount: 650, status: 'paid', fraudScore: 0.12 },
      { id: 'CLM-003', date: '2026-03-28', trigger: 'TRG-RAIN', amount: 1200, status: 'paid', fraudScore: 0.05 },
      { id: 'CLM-004', date: '2026-03-22', trigger: 'TRG-HEAT', amount: 425, status: 'paid', fraudScore: 0.15 },
    ],
    policyHistory: [
      { week: 'Apr 7–13', plan: 'Standard', premium: 59, payouts: 1625, status: 'completed' },
      { week: 'Mar 31–Apr 6', plan: 'Standard', premium: 59, payouts: 0, status: 'completed' },
      { week: 'Mar 24–30', plan: 'Standard', premium: 59, payouts: 1200, status: 'completed' },
      { week: 'Mar 17–23', plan: 'Basic', premium: 29, payouts: 425, status: 'completed' },
    ]
  };
}

export function generateMockWeather(city) {
  const conditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Thunderstorm'];
  const baseTemp = city === 'DEL' ? 42 : city === 'CHN' ? 35 : 30;
  return {
    city,
    temperature: baseTemp + Math.floor(Math.random() * 8 - 4),
    humidity: Math.floor(Math.random() * 40 + 50),
    precipitation: Math.random() > 0.6 ? Math.floor(Math.random() * 50) : 0,
    windSpeed: Math.floor(Math.random() * 25 + 5),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    aqi: Math.floor(Math.random() * 300 + 50),
    updatedAt: new Date().toISOString(),
  };
}

export function calculatePremium(plan, city, zone, weeklyEarnings) {
  const basePlan = PLANS.find(p => p.id === plan);
  if (!basePlan) return null;

  // Zone risk factors (simulated ML output)
  const zoneRiskFactors = {
    'Koramangala': 1.2, 'Andheri': 1.85, 'Connaught Place': 1.1,
    'Madhapur': 0.95, 'T. Nagar': 1.3, 'Indiranagar': 1.1,
    'Bandra': 1.6, 'Dwarka': 1.3, 'Gachibowli': 0.9,
    'Anna Nagar': 1.15, 'default': 1.0
  };

  // Season multiplier (April = pre-monsoon)
  const month = new Date().getMonth();
  const seasonMultipliers = [0.9, 0.9, 1.0, 1.1, 1.3, 1.6, 1.8, 1.7, 1.5, 1.2, 1.1, 0.95];
  const seasonMultiplier = seasonMultipliers[month];

  const zoneRisk = zoneRiskFactors[zone] || zoneRiskFactors['default'];
  const baseRate = 15;
  const calculated = Math.round(baseRate * zoneRisk * seasonMultiplier);

  return {
    finalPremium: Math.max(basePlan.weeklyPremium, calculated + (basePlan.weeklyPremium - 15)),
    breakdown: {
      baseRate,
      zoneRiskFactor: zoneRisk,
      seasonMultiplier,
      planSurcharge: basePlan.weeklyPremium - 15,
    },
    coverageLimit: basePlan.coverageLimit,
    coveragePercent: basePlan.coveragePercent,
    estimatedMaxPayout: Math.round(weeklyEarnings * (basePlan.coveragePercent / 100)),
  };
}

// Admin mock data
export function generateAdminStats() {
  return {
    totalUsers: 12847,
    activeThisWeek: 8932,
    totalPoliciesSold: 34521,
    totalPayouts: 4823150,
    avgFraudScore: 0.11,
    triggersFiredToday: 23,
    revenueThisMonth: 527340,
    claimRatio: 0.62,
    topTriggers: [
      { type: 'TRG-RAIN', count: 156, totalPayout: 1234000 },
      { type: 'TRG-HEAT', count: 98, totalPayout: 678900 },
      { type: 'TRG-AQI', count: 72, totalPayout: 456700 },
      { type: 'TRG-CURFEW', count: 15, totalPayout: 234500 },
      { type: 'TRG-PLATFORM', count: 8, totalPayout: 89000 },
    ],
    recentPayouts: [
      { id: 'PAY-8842', user: 'Ramesh K.', zone: 'Koramangala, BLR', trigger: 'TRG-RAIN', amount: 975, fraudScore: 0.08, time: '12 min ago' },
      { id: 'PAY-8841', user: 'Priya S.', zone: 'Andheri, MUM', trigger: 'TRG-RAIN', amount: 1200, fraudScore: 0.05, time: '18 min ago' },
      { id: 'PAY-8840', user: 'Arun D.', zone: 'Bandra, MUM', trigger: 'TRG-RAIN', amount: 850, fraudScore: 0.22, time: '25 min ago' },
      { id: 'PAY-8839', user: 'Sunil P.', zone: 'Rohini, DEL', trigger: 'TRG-AQI', amount: 650, fraudScore: 0.12, time: '34 min ago' },
      { id: 'PAY-8838', user: 'Meena R.', zone: 'Velachery, CHN', trigger: 'TRG-HEAT', amount: 425, fraudScore: 0.09, time: '41 min ago' },
      { id: 'PAY-8837', user: 'Vijay M.', zone: 'Madhapur, HYD', trigger: 'TRG-PLATFORM', amount: 550, fraudScore: 0.03, time: '52 min ago' },
    ],
    zoneHeatmap: [
      { zone: 'Andheri, Mumbai', risk: 0.92, activeNodes: 342, status: 'critical' },
      { zone: 'Koramangala, Bengaluru', risk: 0.71, activeNodes: 287, status: 'high' },
      { zone: 'Connaught Place, Delhi', risk: 0.45, activeNodes: 198, status: 'moderate' },
      { zone: 'Madhapur, Hyderabad', risk: 0.28, activeNodes: 156, status: 'low' },
      { zone: 'T. Nagar, Chennai', risk: 0.61, activeNodes: 223, status: 'high' },
    ]
  };
}

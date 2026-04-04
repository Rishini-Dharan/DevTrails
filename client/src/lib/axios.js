import originalAxios from 'axios';

// Realistic mock data for a perfect hackathon presentation
const MOCK_DB = {
  users: {
    '123': { id: '123', name: 'Ramesh Kumar', phone: '9876543210', gigPlatform: 'zomato', gigId: 'ZM-4991', city: 'mumbai', zone: 'andheri west', status: 'active', score: 0.05 }
  },
  policies: [
    { id: 'pol_1', userId: '123', plan: 'standard', premium: 59, status: 'active', startDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(), endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(), coverageAmount: 3000 }
  ],
  payouts: [
    { id: 'pay_1', userId: '123', policyId: 'pol_1', triggerId: 'trg_1', amount: 490, processedAt: new Date(Date.now() - 1000000).toISOString(), status: 'completed', createdAt: new Date(Date.now() - 1000000).toISOString(), fraudTier: 'green' }
  ],
  triggers: [
    { id: 'trg_1', eventType: 'heavy_rain', parameter: 'precip_mm_hr', value: 35, threshold: 30, zone: 'andheri west', severity: 'high', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'trg_2', eventType: 'platform_outage', parameter: 'downtime_mins', value: 140, threshold: 120, zone: 'all', severity: 'medium', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'resolved' }
  ],
  analytics: {
    stats: { 
      activePolicies: 342, 
      fundsProtected: 1245000, 
      activeTriggers: 1, 
      totalPayouts: 14,
      totalPayoutAmount: 145000,
      lossRatio: 42,
      totalPremiumCollected: 345000,
      planBreakdown: { basic: 100, standard: 200, premium: 42 },
      payoutStatusBreakdown: { paid: 13, pending: 1, rejected: 0 },
      fraudBreakdown: { green: 13, amber: 1, red: 0 },
      avgFraudScore: 0.04
    },
    fraud: [
      { id: 'c_99', userId: '144', score: 0.92, reason: 'Location Mismatch (15km) + Accelerometer Stationary', status: 'flagged', amount: 800 }
    ]
  },
  weather: {
    city: 'mumbai', zone: 'andheri west', precipitation: 35.5, temperature: 27, aqi: 85
  }
};

const handleMockRequest = async (url, method, configOrData) => {
  console.log(`[Demo Mock] Intercepted ${method.toUpperCase()} ${url}`);
  await new Promise(resolve => setTimeout(resolve, 800));

  if (url.includes('/auth/send-otp')) {
    return { data: { success: true, message: 'OTP Sent' } };
  }
  if (url.includes('/auth/verify-otp')) {
    return { data: { success: true, user: { id: '123' } } };
  }
  if (url.includes('/users/onboard')) {
    return { data: { success: true } };
  }
  if (url.match(/\/users\/\d+/)) {
    return { data: MOCK_DB.users['123'] };
  }
  if (url.includes('/premium/calculate')) {
    const planMatch = url.match(/plan=([^&]*)/);
    const plan = planMatch ? planMatch[1] : 'standard';
    const premiums = { basic: 29, standard: 59, premium: 99 };
    const coverages = { basic: 'Up to ₹1,500', standard: 'Up to ₹3,000', premium: 'Up to ₹5,000' };
    return { 
      data: { 
        plan, premium: premiums[plan], coverage: coverages[plan], 
        riskFactor: 1.4, explanation: "High monsoon probability detected in your delivery zone this week." 
      } 
    };
  }
  if (url.includes('/policies') && method === 'post') {
    return { data: { success: true, policy: MOCK_DB.policies[0] } };
  }
  if (url.includes('/policies')) {
    return { data: MOCK_DB.policies };
  }
  if (url.includes('/triggers/simulate') && method === 'post') {
    const newPayout = {
      id: `pay_demo_${Date.now()}`,
      policyId: 'pol_1',
      amount: 1500,
      status: 'paid',
      upiId: 'ramesh.km@upi',
      transactionId: `pay_TXN${Date.now()}`,
      fraudTier: 'green',
      fraudScore: 0.08,
      reason: 'Parametric Threshold Breached',
      createdAt: new Date().toISOString()
    };
    
    // Store in-memory so it persists during the browser session
    MOCK_DB.payouts.unshift(newPayout);
    MOCK_DB.analytics.stats.totalPayouts += 1;
    MOCK_DB.analytics.stats.totalPayoutAmount += 1500;
    MOCK_DB.analytics.stats.payoutStatusBreakdown.paid += 1;
    MOCK_DB.analytics.stats.fraudBreakdown.green += 1;

    return { 
      data: { 
        success: true,
        payoutsCreated: 1,
        paidInstantly: 1,
        pendingReview: 0,
        rejected: 0,
        totalAmount: 1500,
        payouts: [newPayout]
      }
    };
  }
  if (url.includes('/payouts')) {
    return { data: MOCK_DB.payouts };
  }
  if (url.includes('/weather/')) {
    return { data: MOCK_DB.weather };
  }
  if (url.includes('/dashboard/triggers')) {
    return { data: { active: [MOCK_DB.triggers[0]], recent: [MOCK_DB.triggers[1]] } };
  }
  if (url.includes('/admin/stats') || url.includes('/admin/analytics')) {
    return { data: MOCK_DB.analytics.stats };
  }
  if (url.includes('/admin/fraud')) {
    return { data: MOCK_DB.analytics.fraud };
  }
  return { data: {} };
};

// Expose a mock axios instance
const mockAxios = {
  get: async (url, config) => {
    if (url && typeof url === 'string' && url.includes('localhost:5000')) {
      return handleMockRequest(url, 'get', config);
    }
    return originalAxios.get(url, config);
  },
  post: async (url, data, config) => {
    if (url && typeof url === 'string' && url.includes('localhost:5000')) {
      return handleMockRequest(url, 'post', data);
    }
    return originalAxios.post(url, data, config);
  },
  create: () => mockAxios
};

export default mockAxios;

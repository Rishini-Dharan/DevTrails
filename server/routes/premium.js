const express = require('express');
const router = express.Router();
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// GET /api/premium/calculate
router.get('/calculate', async (req, res) => {
  const { zone, city, pincode, plan = 'standard' } = req.query;

  try {
    const mlRes = await axios.get(`${ML_SERVICE_URL}/premium`, {
      params: { zone, city, pincode, plan },
    });
    res.json(mlRes.data);
  } catch {
    // Fallback premium calculation
    const basePremiums = { basic: 29, standard: 59, premium: 99 };
    const base = basePremiums[plan] || 59;

    res.json({
      plan,
      premium: base,
      riskFactor: 1.0,
      seasonMultiplier: 1.0,
      explanation: 'Using default premium calculation (ML service unavailable). Connect the ML service for AI-powered dynamic pricing.',
      breakdown: {
        baseRate: 15,
        zoneRiskFactor: 1.0,
        seasonMultiplier: 1.0,
        claimHistoryModifier: 1.0,
      },
    });
  }
});

module.exports = router;

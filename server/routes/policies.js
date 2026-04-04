const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Policy, User } = require('../models');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const PLAN_CONFIG = {
  basic: { coverageLimit: 1500, coveragePercent: 0.50, disruptions: 'weather' },
  standard: { coverageLimit: 3000, coveragePercent: 0.65, disruptions: 'weather,aqi,platform' },
  premium: { coverageLimit: 5000, coveragePercent: 0.80, disruptions: 'weather,aqi,social,platform' },
};

// POST /api/policies — create a new policy
router.post('/', async (req, res) => {
  try {
    const { userId, plan } = req.body;

    if (!userId || !plan) return res.status(400).json({ error: 'userId and plan required' });
    if (!PLAN_CONFIG[plan]) return res.status(400).json({ error: 'Invalid plan. Use: basic, standard, premium' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.onboarded) return res.status(400).json({ error: 'User must complete onboarding first' });

    // Calculate premium via ML service
    let premium, riskFactor, riskExplanation;
    try {
      const mlRes = await axios.get(`${ML_SERVICE_URL}/premium`, {
        params: { zone: user.zone, city: user.city, pincode: user.pincode, plan },
      });
      premium = mlRes.data.premium;
      riskFactor = mlRes.data.riskFactor;
      riskExplanation = mlRes.data.explanation;
    } catch {
      // Fallback if ML service is down
      const basePremiums = { basic: 29, standard: 59, premium: 99 };
      premium = basePremiums[plan];
      riskFactor = 1.0;
      riskExplanation = 'Using default premium (ML service unavailable)';
    }

    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const config = PLAN_CONFIG[plan];
    const policy = await Policy.create({
      userId,
      plan,
      premium,
      coverageLimit: config.coverageLimit,
      coveragePercent: config.coveragePercent,
      weekStart: now,
      weekEnd,
      riskFactor,
      riskExplanation,
      disruptionsCovered: config.disruptions,
    });

    res.json({ success: true, policy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/policies/user/:userId — get all policies for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const policies = await Policy.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/policies/:id — get single policy
router.get('/:id', async (req, res) => {
  try {
    const policy = await Policy.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }],
    });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/policies — list all policies (admin)
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

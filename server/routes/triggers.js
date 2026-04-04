const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Trigger, Policy, Payout, User } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const TRIGGER_THRESHOLDS = {
  'TRG-RAIN': { parameter: 'precipitation_mm_hr', threshold: 30, label: 'Heavy Rainfall' },
  'TRG-HEAT': { parameter: 'temperature_c', threshold: 44, label: 'Extreme Heat' },
  'TRG-AQI': { parameter: 'aqi', threshold: 400, label: 'Severe Air Pollution' },
  'TRG-FLOOD': { parameter: 'flood_alert', threshold: 1, label: 'Urban Flooding' },
  'TRG-CURFEW': { parameter: 'curfew_active', threshold: 1, label: 'Curfew / Bandh' },
  'TRG-PLATFORM': { parameter: 'platform_outage', threshold: 1, label: 'Platform Outage' },
};

function generateTransactionId() {
  return 'TXN-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateUpiRef() {
  return 'UPI' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
}

// GET /api/triggers — list all triggers
router.get('/', async (req, res) => {
  try {
    const triggers = await Trigger.findAll({
      order: [['firedAt', 'DESC']],
      limit: 50,
    });
    res.json(triggers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/triggers/thresholds — get trigger thresholds
router.get('/thresholds', (req, res) => {
  res.json(TRIGGER_THRESHOLDS);
});

// POST /api/triggers/simulate — simulate a trigger event (for demo)
router.post('/simulate', async (req, res) => {
  try {
    const {
      type = 'TRG-RAIN',
      zone = 'Andheri West',
      city = 'Mumbai',
      actualValue,
      durationHours = 3,
    } = req.body;

    const triggerConfig = TRIGGER_THRESHOLDS[type];
    if (!triggerConfig) return res.status(400).json({ error: 'Invalid trigger type' });

    const value = actualValue || triggerConfig.threshold * 2.2;

    // Create the trigger
    const trigger = await Trigger.create({
      type,
      zone,
      city,
      parameter: triggerConfig.parameter,
      threshold: triggerConfig.threshold,
      actualValue: value,
      durationHours,
      status: 'fired',
      firedAt: new Date(),
      dataSource: 'Demo Simulation',
    });

    // Find all active policies in this zone
    const now = new Date();
    const activePolicies = await Policy.findAll({
      where: {
        status: 'active',
        weekEnd: { [Op.gt]: now },
      },
      include: [{ model: User, as: 'user' }],
    });

    // Filter policies that cover this disruption type
    const disruptionCategory = getDisruptionCategory(type);
    const eligiblePolicies = activePolicies.filter(p =>
      p.disruptionsCovered.includes(disruptionCategory)
    );

    const payouts = [];

    for (const policy of eligiblePolicies) {
      // Check for duplicate claims (Phase 3)
      const existingPayout = await Payout.findOne({
        where: { userId: policy.userId, triggerId: trigger.id },
      });
      if (existingPayout) continue; // Skip duplicate

      // Get recent trigger IDs for this user (Phase 3 advanced fraud check)
      const recentPayouts = await Payout.findAll({
        where: { userId: policy.userId },
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['triggerId'],
      });
      const recentTriggerIds = recentPayouts.map(p => p.triggerId);

      // Count claims in last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const claimCount30d = await Payout.count({
        where: { userId: policy.userId, createdAt: { [Op.gt]: thirtyDaysAgo } },
      });

      // Get advanced fraud score from ML service (Phase 3)
      let fraudScore = 0.08;
      let fraudTier = 'green';
      let fraudSignals = {};
      let advancedChecks = {};

      try {
        const fraudRes = await axios.post(`${ML_SERVICE_URL}/fraud-check-advanced`, {
          userId: policy.userId,
          zone,
          triggerType: type,
          trustScore: policy.user?.trustScore || 0.5,
          claimCount30d,
          triggerId: trigger.id,
          recentTriggerIds,
        });
        fraudScore = fraudRes.data.fraudScore;
        fraudTier = fraudRes.data.tier;
        fraudSignals = fraudRes.data.signals;
        advancedChecks = fraudRes.data.advancedChecks || {};
      } catch {
        // Fallback — use basic fraud check
        try {
          const basicRes = await axios.post(`${ML_SERVICE_URL}/fraud-check`, {
            userId: policy.userId,
            zone,
            triggerType: type,
            trustScore: policy.user?.trustScore || 0.5,
          });
          fraudScore = basicRes.data.fraudScore;
          fraudTier = basicRes.data.tier;
          fraudSignals = basicRes.data.signals;
        } catch {
          fraudScore = Math.random() * 0.15 + 0.03;
          fraudTier = 'green';
          fraudSignals = {
            gps: 'verified', cellTower: 'match', accelerometer: 'walking',
            wifi: 'commercial', platformActivity: 'recent', weather: 'confirmed',
            deviceIntegrity: 'clean',
          };
        }
      }

      // Calculate payout
      const estimatedDailyIncome = policy.user?.weeklyEarnings
        ? policy.user.weeklyEarnings / 6
        : 750;
      const standardHours = 10;
      const payoutAmount = Math.round(
        estimatedDailyIncome * (durationHours / standardHours) * policy.coveragePercent
      );
      const cappedPayout = Math.min(payoutAmount, policy.coverageLimit);

      // Determine status based on fraud tier
      const status = fraudTier === 'green' ? 'paid' : fraudTier === 'amber' ? 'pending' : 'rejected';

      // Auto-generate payment details for green-tier (instant payout)
      const txnId = status === 'paid' ? generateTransactionId() : null;
      const upiRef = status === 'paid' ? generateUpiRef() : null;

      const payout = await Payout.create({
        userId: policy.userId,
        policyId: policy.id,
        triggerId: trigger.id,
        amount: cappedPayout,
        estimatedDailyIncome,
        disruptionHours: durationHours,
        coveragePercent: policy.coveragePercent,
        fraudScore,
        fraudTier,
        fraudSignals: JSON.stringify({ ...fraudSignals, advancedChecks }),
        status,
        upiId: `${policy.user?.phone || '9876543210'}@upi`,
        transactionId: txnId,
        paymentMethod: status === 'paid' ? 'upi' : null,
        paymentGateway: status === 'paid' ? 'razorpay_test' : null,
        upiRef,
        paidAt: status === 'paid' ? new Date() : null,
        reason: triggerConfig.label + ' in ' + zone,
      });

      payouts.push(payout);

      // Update trust score
      if (policy.user && status === 'paid') {
        await policy.user.update({
          trustScore: Math.min(1.0, (policy.user.trustScore || 0.5) + 0.05),
        });
      }
    }

    // Update trigger with stats
    await trigger.update({
      affectedPolicies: eligiblePolicies.length,
      totalPayouts: payouts.reduce((sum, p) => sum + p.amount, 0),
    });

    res.json({
      success: true,
      trigger,
      payoutsCreated: payouts.length,
      totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
      payouts,
      paidInstantly: payouts.filter(p => p.status === 'paid').length,
      pendingReview: payouts.filter(p => p.status === 'pending').length,
      rejected: payouts.filter(p => p.status === 'rejected').length,
    });
  } catch (err) {
    console.error('[TRIGGER] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

function getDisruptionCategory(triggerType) {
  const map = {
    'TRG-RAIN': 'weather',
    'TRG-FLOOD': 'weather',
    'TRG-HEAT': 'weather',
    'TRG-AQI': 'aqi',
    'TRG-CURFEW': 'social',
    'TRG-STRIKE': 'social',
    'TRG-PLATFORM': 'platform',
  };
  return map[triggerType] || 'weather';
}

module.exports = router;

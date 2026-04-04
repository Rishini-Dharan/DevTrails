const express = require('express');
const router = express.Router();
const axios = require('axios');
const { User, Policy, Payout, Trigger } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../db');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// GET /api/admin/stats — overall platform stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const onboardedUsers = await User.count({ where: { onboarded: true } });
    const totalPolicies = await Policy.count();
    const activePolicies = await Policy.count({
      where: { status: 'active', weekEnd: { [Op.gt]: new Date() } },
    });
    const totalTriggers = await Trigger.count();
    const totalPayouts = await Payout.count();
    const totalPayoutAmount = (await Payout.sum('amount')) || 0;
    const avgFraudScore = (await Payout.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('fraudScore')), 'avg']],
      raw: true,
    }))?.avg || 0;

    const fraudBreakdown = {
      green: await Payout.count({ where: { fraudTier: 'green' } }),
      amber: await Payout.count({ where: { fraudTier: 'amber' } }),
      red: await Payout.count({ where: { fraudTier: 'red' } }),
    };

    const planBreakdown = {
      basic: await Policy.count({ where: { plan: 'basic' } }),
      standard: await Policy.count({ where: { plan: 'standard' } }),
      premium: await Policy.count({ where: { plan: 'premium' } }),
    };

    const totalPremiumCollected = (await Policy.sum('premium')) || 0;
    const paidPayouts = await Payout.count({ where: { status: 'paid' } });
    const pendingPayouts = await Payout.count({ where: { status: 'pending' } });
    const rejectedPayouts = await Payout.count({ where: { status: 'rejected' } });

    res.json({
      totalUsers,
      onboardedUsers,
      totalPolicies,
      activePolicies,
      totalTriggers,
      totalPayouts,
      totalPayoutAmount: Math.round(totalPayoutAmount),
      totalPremiumCollected: Math.round(totalPremiumCollected),
      lossRatio: totalPremiumCollected > 0
        ? Math.round((totalPayoutAmount / totalPremiumCollected) * 100)
        : 0,
      avgFraudScore: parseFloat(avgFraudScore).toFixed(3),
      fraudBreakdown,
      planBreakdown,
      payoutStatusBreakdown: { paid: paidPayouts, pending: pendingPayouts, rejected: rejectedPayouts },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics — expanded analytics data for charts
router.get('/analytics', async (req, res) => {
  try {
    // All payouts with trigger info for time-series
    const allPayouts = await Payout.findAll({
      include: [{ model: Trigger, as: 'trigger' }],
      order: [['createdAt', 'ASC']],
      raw: true,
      nest: true,
    });

    const allPolicies = await Policy.findAll({
      order: [['createdAt', 'ASC']],
      raw: true,
    });

    // Build daily revenue vs payout data
    const dailyData = {};
    allPolicies.forEach(p => {
      const day = new Date(p.createdAt).toISOString().split('T')[0];
      if (!dailyData[day]) dailyData[day] = { date: day, premiums: 0, payouts: 0, claims: 0 };
      dailyData[day].premiums += p.premium || 0;
    });
    allPayouts.forEach(p => {
      const day = new Date(p.createdAt).toISOString().split('T')[0];
      if (!dailyData[day]) dailyData[day] = { date: day, premiums: 0, payouts: 0, claims: 0 };
      dailyData[day].payouts += p.amount || 0;
      dailyData[day].claims += 1;
    });
    const revenueVsPayouts = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

    // Disruption type distribution
    const disruptionTypes = {};
    allPayouts.forEach(p => {
      const type = p.trigger?.type || 'unknown';
      disruptionTypes[type] = (disruptionTypes[type] || 0) + 1;
    });
    const disruptionDistribution = Object.entries(disruptionTypes).map(([type, count]) => ({
      type,
      count,
      label: {
        'TRG-RAIN': 'Heavy Rain', 'TRG-HEAT': 'Extreme Heat', 'TRG-AQI': 'Severe AQI',
        'TRG-FLOOD': 'Flooding', 'TRG-CURFEW': 'Curfew', 'TRG-PLATFORM': 'Platform Outage',
      }[type] || type,
    }));

    // Fraud tier over time
    const fraudTimeline = {};
    allPayouts.forEach(p => {
      const day = new Date(p.createdAt).toISOString().split('T')[0];
      if (!fraudTimeline[day]) fraudTimeline[day] = { date: day, green: 0, amber: 0, red: 0 };
      fraudTimeline[day][p.fraudTier] = (fraudTimeline[day][p.fraudTier] || 0) + 1;
    });
    const fraudOverTime = Object.values(fraudTimeline).sort((a, b) => a.date.localeCompare(b.date));

    // Get predictions from ML service
    let predictions = null;
    try {
      const activePolicies = await Policy.count({
        where: { status: 'active', weekEnd: { [Op.gt]: new Date() } },
      });
      const predRes = await axios.get(`${ML_SERVICE_URL}/predictions`, {
        params: { zone: 'andheri west', city: 'mumbai', active_policies: activePolicies || 10 },
      });
      predictions = predRes.data;
    } catch { /* ML service may be down */ }

    // Zone heatmap from ML
    let zoneHeatmap = null;
    try {
      const heatRes = await axios.get(`${ML_SERVICE_URL}/zone-heatmap`, { params: { city: 'mumbai' } });
      zoneHeatmap = heatRes.data;
    } catch { /* fallback */ }

    res.json({
      revenueVsPayouts,
      disruptionDistribution,
      fraudOverTime,
      predictions,
      zoneHeatmap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/fraud-cases — list flagged claims for investigation
router.get('/fraud-cases', async (req, res) => {
  try {
    const flaggedPayouts = await Payout.findAll({
      where: {
        fraudTier: { [Op.in]: ['amber', 'red'] },
      },
      include: [
        { model: User, as: 'user' },
        { model: Policy, as: 'policy' },
        { model: Trigger, as: 'trigger' },
      ],
      order: [['createdAt', 'DESC']],
    });

    const cases = flaggedPayouts.map(p => ({
      payoutId: p.id,
      userId: p.userId,
      workerName: p.user?.name || 'Unknown',
      workerPhone: p.user?.phone,
      platform: p.user?.gigPlatform,
      amount: p.amount,
      status: p.status,
      fraudScore: p.fraudScore,
      fraudTier: p.fraudTier,
      fraudSignals: p.fraudSignals ? JSON.parse(p.fraudSignals) : {},
      reason: p.reason,
      triggerType: p.trigger?.type,
      triggerZone: p.trigger?.zone,
      triggerFiredAt: p.trigger?.firedAt,
      policyPlan: p.policy?.plan,
      createdAt: p.createdAt,
    }));

    res.json({
      totalCases: cases.length,
      amberCases: cases.filter(c => c.fraudTier === 'amber').length,
      redCases: cases.filter(c => c.fraudTier === 'red').length,
      cases,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/fraud-cases/:payoutId — approve/reject flagged claim
router.put('/fraud-cases/:payoutId', async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "approve" or "reject"' });
    }

    const payout = await Payout.findByPk(req.params.payoutId);
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    if (payout.status === 'paid') return res.json({ message: 'Already paid', payout });

    if (action === 'approve') {
      await payout.update({ status: 'approved', fraudTier: 'green' });
    } else {
      await payout.update({ status: 'rejected' });
    }

    res.json({ success: true, action, payout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

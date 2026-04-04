const express = require('express');
const router = express.Router();
const { Payout, User, Policy, Trigger } = require('../models');
const crypto = require('crypto');

// Simulated Razorpay/UPI Payment Gateway
function generateTransactionId() {
  return 'TXN-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateUpiRef() {
  return 'UPI' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
}

// POST /api/payments/process — Simulate instant UPI payout
router.post('/process', async (req, res) => {
  try {
    const { payoutId } = req.body;
    if (!payoutId) return res.status(400).json({ error: 'payoutId required' });

    const payout = await Payout.findByPk(payoutId, {
      include: [{ model: User, as: 'user' }],
    });
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    if (payout.status === 'paid') {
      return res.json({ success: true, message: 'Already paid', payout });
    }

    // Simulate processing delay (500ms–1.5s)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const txnId = generateTransactionId();
    const upiRef = generateUpiRef();

    await payout.update({
      status: 'paid',
      transactionId: txnId,
      paymentMethod: 'upi',
      paymentGateway: 'razorpay_test',
      upiRef,
      paidAt: new Date(),
    });

    res.json({
      success: true,
      receipt: {
        payoutId: payout.id,
        transactionId: txnId,
        upiRef,
        amount: payout.amount,
        currency: 'INR',
        upiId: payout.upiId,
        status: 'paid',
        gateway: 'Razorpay Test Mode',
        method: 'UPI Instant Transfer',
        paidAt: payout.paidAt,
        reason: payout.reason,
        fraudTier: payout.fraudTier,
      },
    });
  } catch (err) {
    console.error('[PAYMENT] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/process-batch — Process all pending green-tier payouts
router.post('/process-batch', async (req, res) => {
  try {
    const pendingPayouts = await Payout.findAll({
      where: { status: 'approved', fraudTier: 'green' },
      include: [{ model: User, as: 'user' }],
    });

    const results = [];
    for (const payout of pendingPayouts) {
      const txnId = generateTransactionId();
      const upiRef = generateUpiRef();

      await payout.update({
        status: 'paid',
        transactionId: txnId,
        paymentMethod: 'upi',
        paymentGateway: 'razorpay_test',
        upiRef,
        paidAt: new Date(),
      });

      results.push({
        payoutId: payout.id,
        transactionId: txnId,
        amount: payout.amount,
        upiId: payout.upiId,
      });
    }

    res.json({
      success: true,
      processed: results.length,
      totalAmount: results.reduce((sum, r) => sum + r.amount, 0),
      transactions: results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payments/receipt/:payoutId — Get payment receipt
router.get('/receipt/:payoutId', async (req, res) => {
  try {
    const payout = await Payout.findByPk(req.params.payoutId, {
      include: [
        { model: User, as: 'user' },
        { model: Policy, as: 'policy' },
        { model: Trigger, as: 'trigger' },
      ],
    });
    if (!payout) return res.status(404).json({ error: 'Payout not found' });

    res.json({
      receipt: {
        payoutId: payout.id,
        transactionId: payout.transactionId || 'PENDING',
        upiRef: payout.upiRef || null,
        amount: payout.amount,
        currency: 'INR',
        upiId: payout.upiId,
        status: payout.status,
        gateway: payout.paymentGateway || 'N/A',
        method: payout.paymentMethod || 'N/A',
        paidAt: payout.paidAt,
        reason: payout.reason,
        fraudTier: payout.fraudTier,
        fraudScore: payout.fraudScore,
        disruptionHours: payout.disruptionHours,
        coveragePercent: payout.coveragePercent,
        worker: {
          name: payout.user?.name,
          phone: payout.user?.phone,
          platform: payout.user?.gigPlatform,
        },
        policy: {
          plan: payout.policy?.plan,
          premium: payout.policy?.premium,
          coverageLimit: payout.policy?.coverageLimit,
        },
        trigger: {
          type: payout.trigger?.type,
          zone: payout.trigger?.zone,
          firedAt: payout.trigger?.firedAt,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payments/history/:userId — User's payment transaction history
router.get('/history/:userId', async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      where: { userId: req.params.userId, status: 'paid' },
      include: [{ model: Trigger, as: 'trigger' }],
      order: [['paidAt', 'DESC']],
    });

    const transactions = payouts.map(p => ({
      payoutId: p.id,
      transactionId: p.transactionId,
      upiRef: p.upiRef,
      amount: p.amount,
      upiId: p.upiId,
      paidAt: p.paidAt,
      reason: p.reason,
      triggerType: p.trigger?.type,
      zone: p.trigger?.zone,
    }));

    res.json({
      userId: req.params.userId,
      totalTransactions: transactions.length,
      totalAmountPaid: transactions.reduce((sum, t) => sum + t.amount, 0),
      transactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

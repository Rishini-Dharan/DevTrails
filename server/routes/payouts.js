const express = require('express');
const router = express.Router();
const { Payout, Policy, Trigger, User } = require('../models');

// GET /api/payouts/user/:userId — get all payouts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Trigger, as: 'trigger' },
        { model: Policy, as: 'policy' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payouts/:id — get single payout
router.get('/:id', async (req, res) => {
  try {
    const payout = await Payout.findByPk(req.params.id, {
      include: [
        { model: Trigger, as: 'trigger' },
        { model: Policy, as: 'policy' },
        { model: User, as: 'user' },
      ],
    });
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    res.json(payout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payouts — list all payouts (admin)
router.get('/', async (req, res) => {
  try {
    const payouts = await Payout.findAll({
      include: [
        { model: Trigger, as: 'trigger' },
        { model: User, as: 'user' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

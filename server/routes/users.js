const express = require('express');
const router = express.Router();
const { User } = require('../models');

// POST /api/users/onboard
router.post('/onboard', async (req, res) => {
  try {
    const { userId, name, gigPlatform, gigId, city, zone, pincode, weeklyEarnings, language } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({
      name: name || user.name,
      gigPlatform: gigPlatform || user.gigPlatform,
      gigId: gigId || user.gigId,
      city: city || user.city,
      zone: zone || user.zone,
      pincode: pincode || user.pincode,
      weeklyEarnings: weeklyEarnings || user.weeklyEarnings,
      language: language || user.language,
      onboarded: true,
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users — list all users (admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

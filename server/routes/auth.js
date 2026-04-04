const express = require('express');
const router = express.Router();

// In-memory OTP store (simulated)
const otpStore = {};

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid phone number required' });
  }
  // Simulate OTP generation
  const otp = '123456'; // Fixed for demo
  otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  console.log(`[AUTH] OTP sent to ${phone}: ${otp}`);
  res.json({ success: true, message: `OTP sent to ${phone}`, hint: 'Use 123456 for demo' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }

  // Accept any 6-digit OTP for demo
  if (otp.length !== 6) {
    return res.status(400).json({ error: 'OTP must be 6 digits' });
  }

  const { User } = require('../models');
  let user = await User.findOne({ where: { phone } });

  if (!user) {
    user = await User.create({ phone });
  }

  delete otpStore[phone];
  res.json({
    success: true,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      onboarded: user.onboarded,
    },
    token: `demo-token-${user.id}`,
  });
});

module.exports = router;

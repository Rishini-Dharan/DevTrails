/**
 * GigShield Trigger Engine
 * Polling-based weather monitor that auto-creates triggers & payouts
 * when environmental thresholds are breached.
 */

const cron = require('node-cron');
const axios = require('axios');
const { Trigger, Policy, Payout, User } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const WEATHER_API = `http://localhost:${process.env.PORT || 5000}/api/weather`;

const THRESHOLDS = {
  'TRG-RAIN': { parameter: 'precipitation', threshold: 30, label: 'Heavy Rainfall' },
  'TRG-HEAT': { parameter: 'temperature', threshold: 44, label: 'Extreme Heat' },
  'TRG-AQI':  { parameter: 'aqi', threshold: 400, label: 'Severe Air Pollution' },
};

const MONITORED_CITIES = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata'];

function generateTransactionId() {
  return 'TXN-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateUpiRef() {
  return 'UPI' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
}

async function checkWeatherForCity(city) {
  try {
    const res = await axios.get(`${WEATHER_API}/${city}`);
    const weather = res.data;

    for (const [type, config] of Object.entries(THRESHOLDS)) {
      const actual = weather[config.parameter];
      if (actual == null) continue;

      if (
        (type === 'TRG-RAIN' && actual > config.threshold) ||
        (type === 'TRG-HEAT' && actual > config.threshold) ||
        (type === 'TRG-AQI' && actual > config.threshold)
      ) {
        console.log(`⚡ [TRIGGER ENGINE] ${config.label} detected in ${city}: ${actual} > ${config.threshold}`);

        // Check if we already fired this trigger type in this city in the last 6 hours
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const existing = await Trigger.findOne({
          where: {
            type,
            city,
            status: 'fired',
            firedAt: { [Op.gt]: sixHoursAgo },
          },
        });

        if (existing) {
          console.log(`   ↳ Already fired within 6 hours, skipping.`);
          continue;
        }

        // Create trigger
        const trigger = await Trigger.create({
          type,
          zone: city,
          city,
          parameter: config.parameter,
          threshold: config.threshold,
          actualValue: actual,
          durationHours: 3,
          status: 'fired',
          firedAt: new Date(),
          dataSource: 'Trigger Engine (Auto)',
        });

        // Find active policies
        const now = new Date();
        const activePolicies = await Policy.findAll({
          where: { status: 'active', weekEnd: { [Op.gt]: now } },
          include: [{ model: User, as: 'user' }],
        });

        // Filter by city
        const cityPolicies = activePolicies.filter(
          p => p.user?.city?.toLowerCase() === city.toLowerCase()
        );

        let payoutsCreated = 0;
        let totalAmount = 0;

        for (const policy of cityPolicies) {
          const estimatedDailyIncome = policy.user?.weeklyEarnings
            ? policy.user.weeklyEarnings / 6
            : 750;
          const payoutAmount = Math.round(
            estimatedDailyIncome * (3 / 10) * policy.coveragePercent
          );
          const cappedPayout = Math.min(payoutAmount, policy.coverageLimit);

          const txnId = generateTransactionId();
          const upiRef = generateUpiRef();

          await Payout.create({
            userId: policy.userId,
            policyId: policy.id,
            triggerId: trigger.id,
            amount: cappedPayout,
            estimatedDailyIncome,
            disruptionHours: 3,
            coveragePercent: policy.coveragePercent,
            fraudScore: 0.05,
            fraudTier: 'green',
            fraudSignals: JSON.stringify({ source: 'auto-trigger-engine' }),
            status: 'paid',
            upiId: `${policy.user?.phone || '9876543210'}@upi`,
            transactionId: txnId,
            paymentMethod: 'upi',
            paymentGateway: 'razorpay_test',
            upiRef,
            paidAt: new Date(),
            reason: `${config.label} in ${city}`,
          });

          payoutsCreated++;
          totalAmount += cappedPayout;
        }

        // Update trigger stats
        await trigger.update({
          affectedPolicies: cityPolicies.length,
          totalPayouts: totalAmount,
        });

        if (payoutsCreated > 0) {
          console.log(`   ✅ Created ${payoutsCreated} payouts totaling ₹${totalAmount}`);
        }
      }
    }
  } catch (err) {
    // Silently fail — weather API might not be ready yet
  }
}

async function runCheck() {
  console.log(`\n🔍 [TRIGGER ENGINE] Running weather check across ${MONITORED_CITIES.length} cities...`);
  for (const city of MONITORED_CITIES) {
    await checkWeatherForCity(city);
  }
}

function start() {
  console.log('⚙️  Trigger Engine started — polling every 15 minutes');

  // Run first check after 10 seconds (let server stabilize)
  setTimeout(() => {
    runCheck();
  }, 10000);

  // Then every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    runCheck();
  });
}

module.exports = { start, runCheck };

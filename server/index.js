require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const policyRoutes = require('./routes/policies');
const payoutRoutes = require('./routes/payouts');
const triggerRoutes = require('./routes/triggers');
const weatherRoutes = require('./routes/weather');
const premiumRoutes = require('./routes/premium');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');

// Import models to register associations
require('./models');

// Import trigger engine
const triggerEngine = require('./services/triggerEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GigShield API', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`\n🛡️  GigShield API Server running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Weather: http://localhost:${PORT}/api/weather/mumbai`);
      console.log(`   Admin Stats: http://localhost:${PORT}/api/admin/stats\n`);

      // Start the automated trigger engine
      triggerEngine.start();
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

start();

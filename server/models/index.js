const User = require('./User');
const Policy = require('./Policy');
const Trigger = require('./Trigger');
const Payout = require('./Payout');

// Associations
User.hasMany(Policy, { foreignKey: 'userId', as: 'policies' });
Policy.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payout, { foreignKey: 'userId', as: 'payouts' });
Payout.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Policy.hasMany(Payout, { foreignKey: 'policyId', as: 'payouts' });
Payout.belongsTo(Policy, { foreignKey: 'policyId', as: 'policy' });

Trigger.hasMany(Payout, { foreignKey: 'triggerId', as: 'payouts' });
Payout.belongsTo(Trigger, { foreignKey: 'triggerId', as: 'trigger' });

module.exports = { User, Policy, Trigger, Payout };

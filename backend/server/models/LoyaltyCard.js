import mongoose from 'mongoose';

const loyaltyCardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum', 'Diamond'], default: 'Silver' },
    points: { type: Number, default: 0 },
    pointsBalance: { type: Number, default: 0 }, // Available points to redeem
    totalEarned: { type: Number, default: 0 }, // Lifetime points earned
    totalRedeemed: { type: Number, default: 0 }, // Lifetime points redeemed
    issuedDate: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    tierProgress: {
      currentTierPoints: { type: Number, default: 0 },
      nextTierPoints: { type: Number, default: 1000 },
      nextTier: String
    },
    transactions: [
      {
        points: Number,
        type: { type: String, enum: ['earned', 'redeemed', 'expired', 'bonus'] },
        description: String,
        date: { type: Date, default: Date.now },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        balance: Number // Balance after this transaction
      }
    ],
    rewards: [
      {
        rewardId: String,
        name: String,
        pointsRequired: Number,
        redeemed: { type: Boolean, default: false },
        redeemedDate: Date
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

loyaltyCardSchema.index({ user: 1 });
loyaltyCardSchema.index({ tier: 1 });

// Method to add points
loyaltyCardSchema.methods.addPoints = async function(points, description, order = null) {
  this.points += points;
  this.pointsBalance += points;
  this.totalEarned += points;
  this.lastActivity = new Date();
  
  this.transactions.push({
    points,
    type: 'earned',
    description,
    order,
    balance: this.pointsBalance
  });
  
  // Check tier upgrade
  await this.checkTierUpgrade();
  await this.save();
  return this;
};

// Method to redeem points
loyaltyCardSchema.methods.redeemPoints = async function(points, description, order = null) {
  if (this.pointsBalance < points) {
    throw new Error('Insufficient points balance');
  }
  
  this.pointsBalance -= points;
  this.totalRedeemed += points;
  this.lastActivity = new Date();
  
  this.transactions.push({
    points: -points,
    type: 'redeemed',
    description,
    order,
    balance: this.pointsBalance
  });
  
  await this.save();
  return this;
};

// Method to check and upgrade tier
loyaltyCardSchema.methods.checkTierUpgrade = async function() {
  const tierThresholds = {
    'Silver': 0,
    'Gold': 1000,
    'Platinum': 5000,
    'Diamond': 10000
  };
  
  let newTier = this.tier;
  
  if (this.totalEarned >= tierThresholds.Diamond) {
    newTier = 'Diamond';
  } else if (this.totalEarned >= tierThresholds.Platinum) {
    newTier = 'Platinum';
  } else if (this.totalEarned >= tierThresholds.Gold) {
    newTier = 'Gold';
  }
  
  if (newTier !== this.tier) {
    this.tier = newTier;
    this.transactions.push({
      points: 0,
      type: 'bonus',
      description: `Tier upgraded to ${newTier}`,
      balance: this.pointsBalance
    });
  }
  
  // Update tier progress
  const tiers = ['Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentIndex = tiers.indexOf(this.tier);
  if (currentIndex < tiers.length - 1) {
    this.tierProgress.nextTier = tiers[currentIndex + 1];
    this.tierProgress.nextTierPoints = tierThresholds[tiers[currentIndex + 1]];
    this.tierProgress.currentTierPoints = this.totalEarned - tierThresholds[this.tier];
  }
};

export default mongoose.model('LoyaltyCard', loyaltyCardSchema);

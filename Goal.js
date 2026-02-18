const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadlineMonths: { type: Number, required: true },
    priority: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);

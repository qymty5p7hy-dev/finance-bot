const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    lastScoreUpdate: { type: Date }
});

module.exports = mongoose.model('User', userSchema);

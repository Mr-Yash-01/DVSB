const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  OTP: { type: String, default: "None" },
});

module.exports = mongoose.model('voters', voterSchema);

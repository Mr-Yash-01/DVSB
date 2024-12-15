const mongoose = require('mongoose');

/**
 * Defines the schema for the Voter model.
 * 
 * @property {String} voterId - The unique identifier for the voter. This field is required and must be unique.
 * @property {String} email - The email address of the voter. This field is required.
 * @property {String} OTP - The one-time password for the voter. Defaults to "None" if not provided.
 */
const voterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  OTP: { type: String, default: "None" },
});

module.exports = mongoose.model('voters', voterSchema);

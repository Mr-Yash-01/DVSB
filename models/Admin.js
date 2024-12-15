// Import the mongoose library
const mongoose = require('mongoose');

// Define the schema for the admin collection
const adminSchema = new mongoose.Schema({
  // Define the email field with type String and make it required
  email: { type: String, required: true },
  // Define the password field with type String and make it required
  password: { type: String, required: true },
});

// Export the model named 'heads' using the adminSchema
module.exports = mongoose.model('heads', adminSchema);

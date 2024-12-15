const Voter = require('../models/Voter'); // Import the Voter model
const { sendEmail } = require('../utils/emailService'); // Import the sendEmail function from the email service utility
const otpGenerator = require('otp-generator'); // Import the OTP generator library

// Export the sendOtp function to handle OTP sending
exports.sendOtp = async (req, res) => {
  try {
    const { voterId } = req.body; // Extract voterId from the request body

    // Find the voter in the database using the voterId
    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      // If voter is not found, return a 404 response with an error message
      return res.status(404).json({ message: "Voter not registered" });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true });
    // Set OTP expiration time to 2 minutes from now
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // Save the OTP and its expiration time to the voter record
    voter.OTP = otp;
    voter.otpExpiresAt = otpExpiresAt;
    await voter.save(); // Save the updated voter record to the database

    // Send the OTP to the voter's email
    await sendEmail(voter.email, 'Your OTP', `Your OTP is ${otp}`);

    // Return a success response
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    // Return an error response if something goes wrong
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

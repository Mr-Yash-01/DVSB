const Voter = require('../models/Voter');
const { sendEmail } = require('../utils/emailService');
const otpGenerator = require('otp-generator');

exports.sendOtp = async (req, res) => {
  try {
    const { voterId } = req.body;

    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(404).json({ message: "Voter not registered" });
    }

    const otp = otpGenerator.generate(6, { digits: true });
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    voter.otp = otp;
    voter.otpExpiresAt = otpExpiresAt;
    await voter.save();

    await sendEmail(voter.email, 'Your OTP', `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

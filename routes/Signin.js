const express = require('express');
const router = express.Router();
const { sendContract } = require('../sharedVariable'); // Ensure sendContract is correctly initialized
const Voter = require('../models/Voter'); // Assuming you have a Voter model defined
const Admin = require('../models/Admin'); // Assuming you have an Admin model defined
const { sendEmail } = require('../utils/EmailService'); // Ensure sendEmail is correctly imported
const bcrypt = require('bcryptjs');

// POST endpoint for the Signin route
router.post('/voter', async (req, res) => {
    try {
        console.log("Signin request received for voter");
        
        // Extract email and password from request body
        const { voterId, OTP } = req.body;

        // Check if voter exists in the database
        const voter = await Voter.findOne({ voterId });

        if (!voter) {
            return res.status(404).json({ message: "User not exists" });
        }

        // Compare OTP from request with the one stored in the database
        if (voter.OTP !== OTP) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        } else {
            // Reset the OTP after successful login
            voter.OTP = "None";
            await voter.save();
        }

        // Respond with a success message and the result from the contract call
        return res.status(200).json({ message: "Signin successful" });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

router.post('/admin', async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;
        
        // Check if admin exists in the database
        const admin = await Admin.findOne({ email });      

        if (!admin) {
            return res.status(404).json({ message: "Incorrect credentials" });
        }

        // Compare password from request with the one stored in the database
        const isMatch = admin.password === password;

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect credentials" });
        }

        // Respond with a success message and the result from the contract call
        return res.status(200).json({ message: "Signin successful" });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

router.post('/otp', async (req, res) => {
    try {
        // Extract email and password from request body
        const { voterId } = req.body;

        console.log(voterId);
        

        // Check if voter exists in the database
        const voter = await Voter.findOne({ voterId });

        if (!voter) {
            return res.status(404).json({ message: "User not exists" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in voter's otp attribute
        voter.OTP = otp;
        await voter.save();

        // Send mail to voter's registered email
        await sendEmail(voter.email, 'Your OTP', `Your OTP is: ${otp}`);
        
        // Set a timeout to reset the OTP after 200 minutes
        setTimeout(async () => {
            const voterToUpdate = await Voter.findOne({ voterId });
            if (voterToUpdate) {
                voterToUpdate.OTP = "None";
                await voterToUpdate.save();
            }
        }, 2 * 60 * 1000);
        return res.status(200).json({ message: "OTP sent"});

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

module.exports = router;

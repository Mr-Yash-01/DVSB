const express = require('express'); // Import express module
const router = express.Router(); // Create a new router object
const { sendContract } = require('../sharedVariable'); // Import sendContract from sharedVariable
const Voter = require('../models/Voter'); // Import Voter model
const Admin = require('../models/Admin'); // Import Admin model
const { sendEmail } = require('../utils/EmailService'); // Import sendEmail function from EmailService
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// POST endpoint for the Signin route for voters
router.post('/voter', async (req, res) => {
    try {
        console.log("Signin request received for voter"); // Log the request

        // Extract voterId and OTP from request body
        const { voterId, OTP } = req.body;

        // Check if voter exists in the database
        const voter = await Voter.findOne({ voterId });

        if (!voter) {
            return res.status(404).json({ message: "User not exists" }); // Respond with 404 if voter not found
        }

        // Compare OTP from request with the one stored in the database
        if (voter.OTP !== OTP) {
            return res.status(400).json({ message: "OTP expired or invalid" }); // Respond with 400 if OTP is invalid
        } else {
            // Reset the OTP after successful login
            voter.OTP = "None";
            await voter.save(); // Save the updated voter
        }

        // Respond with a success message
        return res.status(200).json({ message: "Signin successful" });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

// POST endpoint for the Signin route for admins
router.post('/admin', async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if admin exists in the database
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Incorrect credentials" }); // Respond with 404 if admin not found
        }

        // Compare password from request with the one stored in the database
        const isMatch = admin.password === password;

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect credentials" }); // Respond with 400 if password is incorrect
        }

        // Respond with a success message
        return res.status(200).json({ message: "Signin successful" });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

// POST endpoint for generating and sending OTP
router.post('/otp', async (req, res) => {
    try {
        // Extract voterId from request body
        const { voterId } = req.body;

        console.log(voterId); // Log the voterId

        // Check if voter exists in the database
        const voter = await Voter.findOne({ voterId });

        if (!voter) {
            return res.status(404).json({ message: "User not exists" }); // Respond with 404 if voter not found
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in voter's otp attribute
        voter.OTP = otp;
        await voter.save(); // Save the updated voter

        // Send mail to voter's registered email
        await sendEmail(voter.email, 'Your OTP', `Your OTP is: ${otp}`);

        // Set a timeout to reset the OTP after 200 minutes
        setTimeout(async () => {
            const voterToUpdate = await Voter.findOne({ voterId });
            if (voterToUpdate) {
                voterToUpdate.OTP = "None";
                await voterToUpdate.save(); // Save the updated voter
            }
        }, 2 * 60 * 1000);

        // Respond with a success message
        return res.status(200).json({ message: "OTP sent" });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

module.exports = router; // Export the router

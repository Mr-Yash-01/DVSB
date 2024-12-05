const express = require('express');
const router = express.Router();
const { sendContract } = require('../sharedVariable');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;


        // Ensure that sendContract is correctly initialized
        const result = await sendContract.verifyAdmin(email, password);
        await sendContract.waitForDeployment();            
        
        return res.status(200).json({ message: "Signin route", result });
    } catch (error) {
        console.error("Error interacting with contract:", error);
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

module.exports = router;

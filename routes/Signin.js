const express = require('express');
const router = express.Router();
const { sendContract } = require('../sharedVariable'); // Ensure sendContract is correctly initialized

// POST endpoint for the Signin route
router.post('/', async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Ensure sendContract is correctly initialized and contract methods are available
        if (!sendContract || !sendContract.verifyAdmin) {
            return res.status(500).json({ message: "Contract methods are not properly initialized" });
        }

        // Interact with the smart contract to verify admin
        const result = await sendContract.verifyAdmin(email, password);

        // If the result is a transaction, wait for deployment (confirm the transaction)
        if (result && result.wait) {
            await result.wait();  // Wait for the transaction to be mined
        } else {
            console.log("Admin verified, no deployment required.");
        }

        // Respond with a success message and the result from the contract call
        return res.status(200).json({ message: "Signin successful", result });

    } catch (error) {
        // Log the error for debugging
        console.error("Error interacting with contract:", error);

        // Respond with an error message
        return res.status(500).json({ message: "Error interacting with contract", error: error.message });
    }
});

module.exports = router;

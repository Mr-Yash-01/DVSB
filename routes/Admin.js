const express = require('express'); // Import express module
const router = express.Router(); // Create a new router object
const bcrypt = require('bcryptjs'); // Import bcryptjs module for password hashing
const { sendContract } = require('../sharedVariable'); // Import sendContract from sharedVariable

// Function to convert date string to Unix timestamp
function convertToUnixTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

// Route to add a new election
router.post('/addElection', async (req, res) => {
    try {
        // Map candidates from request body to the required format
        const candidates = req.body.candidates.map(candidate => ({
            firstName: candidate.firstName,
            middleName: candidate.middleName,
            lastName: candidate.lastName,
            partyName: candidate.partyName,
            votes: 0 // Initialize votes to 0
        }));

        // Convert start and end times to Unix timestamps
        const startTime = convertToUnixTimestamp(req.body.startTime);
        const endTime = convertToUnixTimestamp(req.body.endTime);

        // Call the contract method to add election with details
        await sendContract.addElectionWithDetails(
            req.body.electionName,
            candidates,
            startTime,
            endTime,
            'yash@gmail.com', // Hardcoded email
            'password' // Hardcoded password
        );

    } catch (error) {
        // Log error and send 500 response
        console.error('Error in Contract Call:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Send success response
    return res.status(200).json({ message: "Election added successfully" });
});

// Route to get all elections
router.get('/getElections', async (req, res) => {
    try {
        // Fetch all election names
        const electionNames = await sendContract.getAllElectionNames();
        
        // Fetch details for each election and format the data
        const elections = [];
        for (const name of electionNames) {
            const details = await sendContract.getElectionDetails(name);

            // Convert BigInt values to strings for serialization
            elections.push({
                electionName: details.electionName,
                candidates: details.candidates.map(candidate => ({
                    firstName: candidate.firstName,
                    middleName: candidate.middleName,
                    lastName: candidate.lastName,
                    partyName: candidate.partyName,
                    votes: candidate.votes.toString() // Convert BigInt to string
                })),
                startTime: details.startTime.toString(), // Convert BigInt to string
                endTime: details.endTime.toString() // Convert BigInt to string
            });
        }

        // Send success response with elections data
        return res.status(200).json({ message: "Elections data retrieved successfully", elections });
        
    } catch (error) {
        // Log error and send 500 response
        console.error('Error in Contract Call:', error);
        return res.status(500).json({ message: 'Error retrieving elections data', error: error.message });
    }
});

module.exports = router; // Export the router object

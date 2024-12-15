const express = require('express'); // Import express module
const router = express.Router(); // Create a new router object
const { sendContract } = require('../sharedVariable'); // Import sendContract from sharedVariable

// Define a POST route for the root path
router.post('/', async (req, res) => {
    return res.status(200).json({ message: "User route" }); // Respond with a JSON message
});

// Define a POST route for voting
router.post('/vote', async (req, res) => {
    try {
        // Call the vote function from sendContract with the provided parameters
        await sendContract.vote(req.body.electionName, req.body.candidateName, req.body.userId);
    } catch (error) {
        console.error('Error casting vote:', error); // Log any errors
    }

    return res.status(200).json({ message: "Vote casted successfully" }); // Respond with a success message
});

// Define a GET route to fetch election details
router.get('/getElectionDetails', async (req, res) => {
    let electionDetails; // Declare a variable to hold election details

    try {
        // Call the getElectionDetails function from sendContract with the provided election name
        electionDetails = await sendContract.getElectionDetails(req.query.electionName);
    } catch (error) {
        console.log('Error in getting election details:', error); // Log any errors
    }

    return res.status(200).json({ message: "Election details fetched successfully", electionDetails }); // Respond with the election details
});

// Add a toJSON method to BigInt prototype to convert BigInt to Number
BigInt.prototype.toJSON = function () {
    return Number(this);
};

// Define a GET route to fetch election results
router.get('/getResult', async (req, res) => {
    const { electionName } = req.query; // Extract electionName from query parameters

    if (!electionName) {
        return res.status(400).json({ message: "Election name is required" }); // Respond with an error if electionName is not provided
    }

    let data; // Declare a variable to hold the result data

    try {
        // Call the getElectionResult function from sendContract with the provided election name
        data = await sendContract.getElectionResult(electionName);

        return res.status(200).json({ message: "Result fetched successfully", data: data }); // Respond with the result data
    } catch (error) {
        console.error('Error in getting result:', error); // Log any errors
        return res.status(500).json({ message: 'Error retrieving result data', error: error.message }); // Respond with an error message
    }
});

module.exports = router; // Export the router object

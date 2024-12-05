const express = require('express');
const router = express.Router();
const { sendContract } = require('../sharedVariable');

router.post('/', async (req,res) => {
    return res.status(200).json({message : "User route"});

});

router.post('/vote', async (req,res) => {
    
    try {
        await sendContract.vote(req.body.electionName, req.body.candidateName,req.body.userId);
        
      } catch (error) {
        console.error('Error casting vote:', error);
      }

    return res.status(200).json({message : "Vote casted successfully"});
    
});

router.get('/getElectionDetails', async (req, res) => {

    let electionDetails;

    try {
        electionDetails = await sendContract.getElectionDetails(req.query.electionName);
        
    } catch (error) {
        console.log('Error in getting election details:', error);
        
    }

    return res.status(200).json({message : "Election details fetched successfully",electionDetails});
});

BigInt.prototype.toJSON = function () {
    return Number(this);
};

router.get('/getResult', async (req, res) => {
    const { electionName } = req.query;

    if (!electionName) {
        return res.status(400).json({ message: "Election name is required" });
    }

    let data; // Declare data here

    try {
        // Fetch election result
        data = await sendContract.getElectionResult(electionName);

        return res.status(200).json({ message: "Result fetched successfully", data: data });
        
    } catch (error) {
        console.error('Error in getting result:', error);
        return res.status(500).json({ message: 'Error retrieving result data', error: error.message });
    }
});



module.exports = router;
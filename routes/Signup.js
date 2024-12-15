const express = require('express');
const router = express.Router();
/**
 * Import the sendContract function from the sharedVariable module.
 * This function is used to send a contract in the signup process.
 */
const {sendContract} = require('../sharedVariable');

router.post('/', async (req,res) => {
    return res.status(200).json({message : "Signup route"});

});

module.exports = router;
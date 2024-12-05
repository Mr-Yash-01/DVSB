const express = require('express');
const router = express.Router();
const {sendContract} = require('../sharedVariable');

router.post('/', async (req,res) => {
    return res.status(200).json({message : "Signup route"});

});

module.exports = router;
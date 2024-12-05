const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const adminRouter = require('./Admin');
const userRouter = require('./User');

router.use('/admin',adminRouter);
router.use('/user',userRouter);

router.post('/', async (req,res) => {
    return res.status(200).json({message : "DashBoard route"});

});

module.exports = router;
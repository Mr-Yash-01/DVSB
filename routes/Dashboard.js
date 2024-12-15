const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router object
const bcrypt = require('bcryptjs'); // Import the bcryptjs module for password hashing
const adminRouter = require('./Admin'); // Import the admin router
const userRouter = require('./User'); // Import the user router

// Use the admin router for routes starting with '/admin'
router.use('/admin', adminRouter);

// Use the user router for routes starting with '/user'
router.use('/user', userRouter);

// Define a POST route for the root of the dashboard
router.post('/', async (req, res) => {
    return res.status(200).json({ message: "DashBoard route" }); // Send a JSON response with a message
});

module.exports = router; // Export the router object
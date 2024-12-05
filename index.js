const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const signupRouter = require('./routes/Signup');
const signinRouter = require('./routes/Signin');
const dashboardRouter = require('./routes/Dashboard');

// Load environment variables from .env file
dotenv.config({ path: '../.env' }); // Specify the relative path to your .env file

const app = express();

// Define allowed origins for production
const allowedOrigins = [
    'https://dvsf-gj15.onrender.com', // Replace with your actual frontend URL
];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request if the origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request if the origin is not allowed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the specified HTTP methods
  credentials: true, // Allow credentials (e.g., cookies or Authorization headers)
};

app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
app.use(express.json()); // Middleware to parse incoming JSON data

// Define the routes for different API endpoints
app.use('/dashboard', dashboardRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

// Set the port to either the one in the environment or fallback to 3000
const PORT = process.env.PORT || 3000; // Render provides the PORT dynamically in production
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the port when the server starts
});

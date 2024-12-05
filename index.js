const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const signupRouter = require('./routes/Signup');
const signinRouter = require('./routes/Signin');
const dashboardRouter = require('./routes/Dashboard');

dotenv.config({ path: '../.env' }); // Specify the relative path to your .env file

const app = express();

// Define allowed origins for production
const allowedOrigins = [
  'https://dvsb.onrender.com' , // Replace with your frontend deployment URL
];

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods to allow
  credentials: true, // Allow credentials (e.g., cookies or Authorization headers)
};

app.use(cors(corsOptions)); // Use CORS with the specified options
app.use(express.json()); // Middleware to parse JSON

// Define routes
app.use('/dashboard', dashboardRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

// Start the server
const PORT = process.env.PORT || 3000; // Use the port from .env or fallback to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

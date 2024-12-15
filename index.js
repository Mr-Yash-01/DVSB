const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/Db'); // MongoDB connection
const signinRouter = require('./routes/Signin');
const signupRouter = require('./routes/Signup');
const dashboardRouter = require('./routes/Dashboard');

// Load environment variables
dotenv.config({ path: './.env' });

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  'https://dvsf-gj15.onrender.com', // Replace with your actual frontend URL
  'http://localhost:3000', // Add localhost for development
  'http://localhost:5173', // Add localhost for development
];
const corsOptions = {
  origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Route Mapping
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/dashboard', dashboardRouter);

// Set port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

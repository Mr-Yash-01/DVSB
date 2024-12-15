const mongoose = require('mongoose');

/**
 * Asynchronously connects to the MongoDB database using Mongoose.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successful.
 * @throws Will log an error message and exit the process with a failure code if the connection fails.
 * 
 * @example
 * // Call the function to connect to the database
 * connectDB();
 * 
 * @description
 * This function attempts to establish a connection to the MongoDB database using the connection string
 * provided in the environment variable `MONGO_URI`. It uses the `useNewUrlParser` and `useUnifiedTopology`
 * options to ensure compatibility with the latest MongoDB driver. If the connection is successful, it logs
 * the host of the connected database. If the connection fails, it logs the error message and exits the process
 * with a failure code (1).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;

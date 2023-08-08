// Import required modules and libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config(); // Load environment variables from .env file
const app = express(); // Create an instance of the Express application
const Course = require('./models/courses.js') // Import the Course model from a separate file
const PORT = process.env.PORT || 3000; // Set the port number from environment variable or default to 3000
const CONNECTION = process.env.CONNECTION // Get the MongoDB connection string from environment variables

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies in requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies in requests
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for the application

const mongoose = require('mongoose'); // Import the Mongoose library
mongoose.set('strictQuery', false); // Disable strict queries in Mongoose

// Function to remove spaces from input and convert comma-separated string to an array of numbers
function prepareArray(inputString) {
  const noSpaceString = inputString.replace(/\s+/g, "");
  const preparedString = noSpaceString.split(',').map(Number);
  return preparedString;
}

// Function to calculate the final grade based on weights and grades
function calculateGrade(weight, grades) {
  const preparedArray = prepareArray(grades);
  const preparedWeight = parseFloat(weight);
  const sum = preparedArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const total = (sum / preparedArray.length) * (preparedWeight / 100);
  const roundedTotal = total.toFixed(3);
  return roundedTotal;
}

// Define a POST route to handle adding courses and calculating grades
app.post('/calculator/add', async (req, res) => {
  console.log('Received POST request:', req.body);

  const { student, courses } = req.body;

  // Transform the input data into a structured format for the Course model
  const newCourses = courses.map(course => ({
    courseName: course.name,
    sections: course.assignments.map(assignment => ({
      sectionName: assignment.section,
      weight: assignment.weight,
      grades: assignment.grades,
      finalGrade: calculateGrade(assignment.weight, assignment.grades)
    }))
  }));

  // Create a new Course instance with the transformed data
  const course = new Course({
    user: student,
    courses: newCourses
  });

  try {
    // Save the course to the database
    const savedCourse = await course.save();
    console.log('Saved course object:', savedCourse);
    res.status(201).json({ course: savedCourse });
  } catch (err) {
    console.error('Error saving course:', err);
    res.status(400).json({ error: err.message });
  }
});

// Function to connect to the MongoDB database and start the Express server
const start = async () => {
  try {
    await mongoose.connect(CONNECTION); // Connect to the MongoDB database

    // Start the Express server and listen on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

// Call the start function to initiate the application
start();

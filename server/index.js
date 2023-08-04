// Assuming you have already set up your Express server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Route handler for handling the POST request at '/class' endpoint
app.post('/class', (req, res) => {
  // Access the data sent from the frontend
  const classObject = req.body;

  // Here, you can process the classObject data and create a new class based on it
  // For example, you can store the data in a database or perform any other business logic
  // You can also send a response back to the client to indicate the success or failure of the operation

  // Assuming you have a class model and a database, you can save the data to the database
  // For example, using a hypothetical Class model and MongoDB as the database:
  // const Class = require('./models/Class');
  // const newClass = new Class(classObject);
  // newClass.save()
  //   .then(savedClass => {
  //     res.status(201).json({ message: 'Class created successfully', class: savedClass });
  //   })
  //   .catch(err => {
  //     res.status(500).json({ error: 'Failed to create class', details: err.message });
  //   });

  // For simplicity, in this example, we'll just log the received data and send a response
  console.log('Received data:');
  classObject.forEach(course => {
    console.log('Course:', course.name);
    course.assignments.forEach((assignment, index) => {
      console.log(`Assignment ${index + 1}:`, assignment);
    });
    console.log('---');
  });

  res.status(200).json({ message: 'Class data received successfully' });
});

// Start the server and listen on a port (e.g., 3001)
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

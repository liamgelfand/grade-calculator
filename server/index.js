// Assuming you have already set up your Express server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const app = express();

const Course = require('./models/courses.js')

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// const course = new Course({
//   course: 'Math',
//   section: 'Test',
//   weight: '25',
//   grades: '78, 95, 77'
// });

// course.save();

app.get('/', (req, res) => {
  res.send(course)
})

app.get('/api/course', async (req, res) => {
  // gets all courses
  try {
    const result = await Course.find();
    res.send({"courses": result});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
})

app.get('/api/course/:id', async (req, res) => {
  // gets course by id only
  console.log({requestParams: req.params});
  try {
    const {id: courseId} = req.params;
    console.log(courseId)
    const course = await Course.findById(courseId);
    console.log(course);
    if (!course){
        res.status(404).json({error: 'Course not found'})
    } else {
        res.json({course});
    }
  } catch(err) {
      res.status(500).json({error: 'Something went wrong'})
  }
});

app.post('/api/course', async (req, res) => {
  // saves a course to mongodb
  console.log(req.body);
  const course = new Course(req.body);
  try {
    await course.save();
    res.status(201).json({course});
  } catch(err){
    res.status(400).json({error: err.message});
  }
});

app.put('/api/course/:id', async(req, res) => {
  const courseId = req.params.id;
  const result = await Course.replaceOne({_id: courseId}, req.body);
  console.log(result);
  res.json({updatedCount: result.modifiedCount});
})

app.delete('/api/course/:id', async(req, res) => {
  const courseId = req.params.id;
  const result = await Course.deleteOne({_id: courseId});
  res.json({deletedCount: result.deletedCount});
});

// Route handler for handling the POST request at '/class' endpoint
app.post('/class', (req, res) => {
  // Logs data sent over from frontend
  const classObject = req.body;
  console.log(classObject)
});

// Start the server and listen on a port (e.g., 3001)
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION

const start = async() => {
  try{
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
      console.log(err.message)
  }
};

start();

// console.log('Received data:');
// classObject.forEach(course => {
//   console.log('Course:', course.name);
//   course.assignments.forEach((assignment) => {
//     console.log('Section:', assignment.section);
//     console.log('Weight:', assignment.weight);
//     console.log('Grades:', assignment.grades);

//     const classes1 = new Classes({
//       class_name: str(course.name),
//       section_name: str(assignment.section),  
//       weight: str(assignment.weight),
//       grades: str(assingment.grades)
//   });
//   console.log('----------------------------');
// });
// });
// res.status(200).json({ message: 'Class data received successfully' });
// });

//Post to add class --- Put to modify class  
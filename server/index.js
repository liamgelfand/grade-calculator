// Assuming you have already set up your Express server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const app = express();
const Course = require('./models/courses.js')
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

function prepareArray(inputString) {
  const noSpaceString = inputString.replace(/\s+/g, "");
  const preparedString = noSpaceString.split(',');
  return preparedString;
}

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
  // updates certain course values
  const courseId = req.params.id;
  const result = await Course.replaceOne({_id: courseId}, req.body);
  console.log(result);
  res.json({updatedCount: result.modifiedCount});
})

app.delete('/api/course/:id', async(req, res) => {
  //  deletes course
  const courseId = req.params.id;
  const result = await Course.deleteOne({_id: courseId});
  res.json({deletedCount: result.deletedCount});
});

app.get('/gradecalc/calculate/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course){
        res.status(404).json({error: 'Course not found'})
    } else {
        res.json({course});
    }
  } catch(err) {
      res.status(500).json({error: 'Something went wrong'})
  }
})

// Route handler for handling the POST request at '/class' endpoint
app.post('/gradecalc/addclass', async (req, res) => {
  // Logs data sent over from frontend
  const classObject = req.body;
  const courseIds = [];

  try {
    for (const course of classObject) {
      // Create a new course document
      const newCourse = new Course({
        course: course.name,
      });

      // Save the new course document
      await newCourse.save();

      // iterates through and adds sectionname, weight, and grades
      course.assignments.forEach(assignment => {
        newCourse.sections.push({
          sectionName: assignment.section,
          weight: assignment.weight,
          grades: prepareArray(assignment.grades)
        });
      })
      // saves updated course to the collection
      await newCourse.save();
      console.log(`Added course ${course.name} with sections`); 
      //  adds courseId to be used by frontend
      courseIds.push(`${newCourse._id}`);
      console.log(courseIds)
    }
    // returns courseIds if collection creation was successful
    res.status(200).json({
      message: 'Courses and sections added successfully',
      courseIds: courseIds.join(',')
  });
  // handles error if collection creation had an error
  } catch(err) {
    res.status(500).json({error: err.message})
  }
});

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

//Post to add class --- Put to modify class 
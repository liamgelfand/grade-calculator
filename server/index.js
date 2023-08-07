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
  const preparedString = noSpaceString.split(',').map(Number);
  return preparedString;
}

function calculateGrade(weight, grades) {
  const preparedArray = prepareArray(grades);
  const preparedWeight = parseFloat(weight);
  const sum = preparedArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const total = (sum / preparedArray.length) * (preparedWeight / 100);
  const roundedTotal = total.toFixed(3);
  return roundedTotal;
}


app.post('/calculator/add', async (req, res) => {
  console.log('Received POST request:', req.body);

  const { student, courses } = req.body;

  const newCourses = courses.map(course => ({
    courseName: course.name,
    sections: course.assignments.map(assignment => ({
      sectionName: assignment.section,
      weight: assignment.weight,
      grades: assignment.grades,
      finalGrade: calculateGrade(assignment.weight, assignment.grades)
    }))
  }));

  const course = new Course({
    user: student,
    courses: newCourses
  });

  try {
    const savedCourse = await course.save();
    console.log('Saved course object:', savedCourse);
    res.status(201).json({course: savedCourse});
  } catch (err) {
    console.error('Error saving course:', err);
    res.status(400).json({ error: err.message });
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

// app.get('/gradecalc/calculate/:id', async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const course = await Course.findById(courseId);
//     if (!course){
//         res.status(404).json({error: 'Course not found'})
//     } else {
//         res.json({course});
//     }
//   } catch(err) {
//       res.status(500).json({error: 'Something went wrong'})
//   }
// })

// -----------------------------------------------------------

// app.delete('/api/course/:id', async(req, res) => {
//   //  deletes course
//   const courseId = req.params.id;
//   const result = await Course.deleteOne({_id: courseId});
//   res.json({deletedCount: result.deletedCount});
// });

// ---------------------------------------------------------

// app.get('/api/course/:id', async (req, res) => {
//   // gets course by id only
//   console.log({requestParams: req.params});
//   try {
//     const {id: courseId} = req.params;
//     console.log(courseId)
//     const course = await Course.findById(courseId);
//     console.log(course);
//     if (!course){
//         res.status(404).json({error: 'Course not found'})
//     } else {
//         res.json({course});
//     }
//   } catch(err) {
//       res.status(500).json({error: 'Something went wrong'})
//   }
// });

// ---------------------------------------------------------

// app.put('/api/course/:id', async(req, res) => {
//   // updates certain course values
//   const courseId = req.params.id;
//   const result = await Course.replaceOne({_id: courseId}, req.body);
//   console.log(result);
//   res.json({updatedCount: result.modifiedCount});
// })

// ------------------------------------------------------------

// app.post('/gradecalc/addclass', async (req, res) => {
  // FAILED POST ATTEMPT!
//   // Logs data sent over from frontend
//   const classObject = req.body;
//   const courseIds = [];

//   try {
//     for (const course of classObject) {
//       // Create a new course document
//       const newCourse = new Course({
//         course: course.name,
//       });

//       // Save the new course document
//       await newCourse.save();

//       // iterates through and adds sectionname, weight, and grades
//       course.assignments.forEach(assignment => {
//         newCourse.sections.push({
//           sectionName: assignment.section,
//           weight: assignment.weight,
//           grades: prepareArray(assignment.grades)
//         });
//       })
//       // saves updated course to the collection
//       await newCourse.save();
//       console.log(`Added course ${course.name} with sections`); 
//       //  adds courseId to be used by frontend
//       courseIds.push(`${newCourse._id}`);
//       console.log(courseIds)
//     }
//     // returns courseIds if collection creation was successful
//     res.status(200).json({
//       message: 'Courses and sections added successfully',
//       courseIds: courseIds.join(',')
//   });
//   // handles error if collection creation had an error
//   } catch(err) {
//     res.status(500).json({error: err.message})
//   }
// });
// 
// --------------------------------------------------------------
// 
// app.get('/', (req, res) => {
//   res.send(course)
// })

// -------------------------------------------

// app.get('/api/course', async (req, res) => {
//   // gets all courses
//   try {
//     const result = await Course.find();
//     res.send({"courses": result});
//   } catch(err) {
//     res.status(500).json({error: err.message});
//   }
// })
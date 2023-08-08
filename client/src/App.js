import React, { useEffect } from "react";
import "./App.css";

export default function App() {
  // State to keep track of the number of assignments
  const [numAssignments, setNumAssignments] = React.useState(0);

  // State to store class information
  const [classes, setClasses] = React.useState([
    { name: '', assignments: [{ section: '', weight: '', grades: '' }], totalGrade: 0 }
  ]);

  // State to store student's name
  const [studentName, setStudentName] = React.useState("");

  // Function to add a new class
  const addClass = () => {
    let newClass = { name: '', assignments: [{ section: '', weight: '', grades: '' }] };
    setClasses([...classes, newClass]);
  };

  // Function to handle changes in course or assignment data
  const handleCourseChange = (courseIndex, assignmentIndex, event) => {
    let classData = [...classes];
    if (event.target.name === 'name') {
      classData[courseIndex][event.target.name] = event.target.value;
      setClasses(classData);
    } else {
      classData[courseIndex].assignments[assignmentIndex][event.target.name] = event.target.value;
      setClasses(classData);
    }
  };

  // Function to add a new assignment to a specific course
  function addAssignment(courseIndex) {
    let classData = [...classes];
    let classToModify = classData[courseIndex];
    let newAssignment = { type: '', weight: '', grade: '' };
    classToModify.assignments.push(newAssignment);
    setNumAssignments(numAssignments + 1);
    // setClasses([...classes, classToModify]); // This line seems unnecessary and can be omitted
  }

  function submit(e) {
    // Create a copy of the classes array to avoid modifying the original data directly
    let classData = [...classes];
  
    // Prevent the default form submission behavior
    e.preventDefault();
  
    // Create an object to send to the server, containing student's name and class data
    let objectToSend = {
      student: studentName,
      courses: classData
    };
  
    // Log the object about to be sent to the server
    console.log("You are about to send over:", objectToSend);
  
    // Convert the object to JSON format
    const requestBody = JSON.stringify(objectToSend);
  
    // Define the API endpoint for the server
    const apiEndpoint = 'http://localhost:3001/calculator/add';
  
    // Declare a variable to hold the updated class data
    let updatedClasses;
  
    // Send a POST request to the server
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data sent successfully:', data);
  
        // Calculate and update total grades for each course based on the server response
        data.course.courses.forEach((course, courseIndex) => {
          let calculatedTotalGrade = 0;
          course.sections.forEach((section) => {
            calculatedTotalGrade += parseFloat(section.finalGrade);
          });
  
          // Create a copy of the classes array to update the total grade
          const updatedClasses = [...classes];
          updatedClasses[courseIndex].totalGrade = calculatedTotalGrade.toFixed(3);
  
          // Update the state with the updated class data
          setClasses(updatedClasses);
        });
  
        // Log the calculated total grades for each course
        updatedClasses.forEach((course, courseIndex) => {
          console.log(`Total Grade for Course ${course.name}: ${course.totalGrade}`);
        });
      })
      .catch((error) => {
        console.error('Error fetching calculated grade:', error);
      });
  }
  

const changeText = (e) => {
  //setTextValue(e.target.value);
  setStudentName(e.target.value);
  }

  return (
    <div className="large-box">
      <h1 className="title">Grade Calculator</h1>
      <form onSubmit={(e) => submit(e)}>
        {/* Input field for entering student's name */}
        <input
          className='user-name'
          name='student-name'
          placeholder='Student Name'
          value={studentName}
          onChange={changeText}
        />
        {/* Container for adding a new class */}
        <div className="add-class-container">
          <button className="add-class-button" type="button" onClick={addClass}>
            Add Class
          </button>
        </div>
        {/* Mapping over the classes array to display each class */}
        {classes.map((input, courseIndex) => (
          <div key={courseIndex} className='course-container'>
            {/* Input field for entering class name */}
            <input
              className='class-name'
              name='name'
              placeholder='Class Name'
              value={input.name}
              onChange={(event) => handleCourseChange(courseIndex, null, event)}
            />
            {/* Mapping over assignments within a class to display each assignment */}
            {input.assignments.map((assignment, assignmentIndex) => (
              <div className='section' key={assignmentIndex}>
                <span>
                  {/* Input field for entering section name */}
                  <input
                    className="section-input"
                    name='section'
                    placeholder='Section Name'
                    value={assignment.section}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
                <span>
                  {/* Input field for entering assignment weight */}
                  <input
                    className="weight-input"
                    name='weight'
                    placeholder='Weight (%)'
                    value={assignment.weight}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
                {/* Input field for entering section grades */}
                <input
                  className="grades-input"
                  name='grades'
                  placeholder='Section Grades (Comma separated list)'
                  value={assignment.grades}
                  onChange={(event) =>
                    handleCourseChange(courseIndex, assignmentIndex, event)
                  }
                />
              </div>
            ))}
            {/* Button for adding a new section/assignment */}
            <button className="add-section-button" type="button" onClick={() => addAssignment(courseIndex)}>
              Add Section
            </button>
            {/* Display the calculated total grade for the class */}
            <div className="final-grade">Final Grade: {input.totalGrade}</div>
          </div>
        ))}
        {/* Button for submitting the form */}
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}  
   

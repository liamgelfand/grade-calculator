import React, {useEffect} from "react";
import "./App.css";

export default function App() {
  const [numAssignments, setNumAssignments]=React.useState(0)
  const [classes, setClasses]=React.useState([{name:'', assignments:[{section:'', weight:'', grades:''}], totalGrade:0}])
  const [studentName, setStudentName]=React.useState("")


const addClass = () => {
  let newClass = { name: '', assignments:[{section:'', weight:'', grades:''}]}
  setClasses([...classes, newClass])
}



const handleCourseChange = (courseIndex,assignmentIndex, event) => {
  let classData = [...classes];
  if (event.target.name==='name'){
    classData[courseIndex][event.target.name] = event.target.value;
    setClasses(classData);
  }
  else{
    classData[courseIndex].assignments[assignmentIndex][event.target.name]=event.target.value
    setClasses(classData);
  }
 
}

 function addAssignment(courseIndex){
  let classData = [...classes];
  let classToModify=classData[courseIndex]
  let newAssignment={type:'', weight:'', grade:''}  
  classToModify.assignments.push(newAssignment)
  setNumAssignments(numAssignments+1)
 // setClasses([...classes, classToModify])
}

function submit(e) {
  let classData = [...classes];
  e.preventDefault();
  let objectToSend={student:studentName,
  courses:classData}
  console.log("you are about to send over", objectToSend);

  const requestBody = JSON.stringify(objectToSend);
  const apiEndpoint = 'http://localhost:3001/calculator/add';

  let updatedClasses;

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

      data.course.courses.forEach((course, courseIndex) => {
        let calculatedTotalGrade = 0;
        course.sections.forEach((section) => {
          calculatedTotalGrade += parseFloat(section.finalGrade);
        });
        const updatedClasses = [...classes];
        updatedClasses[courseIndex].totalGrade = calculatedTotalGrade.toFixed(3);
        setClasses(updatedClasses);
      });
      updatedClasses.forEach((course, courseIndex) => {
        console.log(`Total Grade for Course ${course.name}: ${course.totalGrade}`)
      })
      }).catch((error) => {
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
        <span>
          <input
            className='user-name'
            name='student-name'
            placeholder='Student Name'
            value={studentName}
            onChange={changeText}
          />
        </span>
        <div className="add-class-container">
          <button className="add-class-button" onClick={addClass}>
            <span className="plus-icon"></span> Add Class
          </button>
        </div>
  
        {classes.map((input, courseIndex) => (
          <div key={courseIndex} className='course'>
            <input
              className='class-name'
              name='name'
              placeholder='Class Name'
              value={input.name}
              onChange={(event) => handleCourseChange(courseIndex, null, event)}
            />
            {input.assignments.map((assignment, assignmentIndex) => (
              <div className='section' key={assignmentIndex}>
                <span>
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
                  <input
                    className="weight-input"
                    name='weight'
                    placeholder='Assignment Weight (%)'
                    value={assignment.weight}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
                <span>
                  <input
                    className="grades-input"
                    name='grades'
                    placeholder='Section Grades'
                    value={assignment.grades}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
              </div>
            ))}
            <button className="add-section-button" type="button" onClick={() => addAssignment(courseIndex)}>
              Add Section
            </button>
            <div className="final-grade">Final Grade: {input.totalGrade}</div>
          </div>
        ))}
        <button className="submit-button" type="submit" onClick={(e) => submit(e)}>
          Submit
        </button>
      </form>
    </div>
  );
}
   

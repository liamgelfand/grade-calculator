import React, {useEffect} from "react";
import "./App.css";

export default function App() {
  const [numAssignments, setNumAssignments]=React.useState(0)
  const [classes, setClasses]=React.useState([{name:'', assignments:[{section:'', weight:'', grades:''}]}])
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
  const apiEndpoint = 'http://localhost:3001/gradecalc/addclass';

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

      const courseIds = data.courseIds;

      courseIds.forEach((courseId) => {
        fetch(`http://localhost:3001/gradecalc/calculate/${courseId}`)
          .then((response) => response.json())
          .then((calculatedData) => {

            // Display the course name and ID in the "Final Grade" div
            console.log(calculatedData)
            document.getElementById('finalgrade').textContent = calculatedData;
          })
          .catch((error) => {
            console.error('Error fetching calculated grade:', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error sending data to API:', error);
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
    <input
              className='class-name'
              name='student-name'
              placeholder='Student Name'
              value={studentName}
              onChange={changeText}
            />
    <div className="add-class-container">
      <p className="add-class-text">Add Class</p>
      <button className="add-class-button" onClick={addClass} label="Add Class">+</button>
    </div>
  
      {classes.map((input, courseIndex) => {
        return (
          <div key={courseIndex} className='course'>
            <input
              className='class-name'
              name='name'
              placeholder='Class Name'
              value={input.name}
              onChange={(event) => handleCourseChange(courseIndex, null, event)}
            />
            <button type="button" onClick={() => addAssignment(courseIndex)}>Add Section</button>
            <div id="finalgrade" className="final-grade">Final Grade</div>
            {
              // want to continually monitor for updates to re-render the input assignments
              // problem: it does not update as you go
            }
            {input.assignments.map((assignment, assignmentIndex) => {
              return (
                <div className='section-name'>
                  <input
                    className="section-input"
                    name='section'
                    placeholder='Section Name'
                    value={input.assignments.type}
                    onChange={(event) => handleCourseChange(courseIndex, assignmentIndex, event)}
                  />
                  <input
                    className="weight-input"
                    name='weight'
                    placeholder='Assignment Weight (%)'
                    value={input.assignments.weight}
                    onChange={(event) => handleCourseChange(courseIndex, assignmentIndex, event)}
                  />
                  <input
                    className="grades-input"
                    name='grades'
                    placeholder='Section Grades'
                    value={input.assignments.grade}
                    onChange={(event) => handleCourseChange(courseIndex, assignmentIndex, event)}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </form>
    <button  className="submit-button" type="submit" onClick={(e)=>submit(e)}>Submit</button>
  </div>
)}
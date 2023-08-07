import React, {useEffect} from "react";
import "./App.css";

export default function App() {
  const [numSections, setNumSections]=React.useState(0)
  const [classes, setClasses]=React.useState([{name:'', sections:[{section:'', weight:'', grades:''}]}])
  const [studentName, setStudentName]=React.useState("")

const addClass = () => {
  let newClass = { name: '', assignments:[{section:'', weight:'', grades:''}]}
  setClasses([...classes, newClass])
}


const handleCourseChange = (courseIndex, sectionIndex, event) => {
  let classData = [...classes];
  if (event.target.name==='name'){
    classData[courseIndex][event.target.name] = event.target.value;
    setClasses(classData);
  }
  else{
    classData[courseIndex].sections[sectionIndex][event.target.name]=event.target.value
    setClasses(classData);
  }
 
}

 function addSection(courseIndex){
  let classData = [...classes];
  let classToModify=classData[courseIndex];
  let newSection={type:'', weight:'', grade:''}  
  classToModify.sections.push(newSection)
  setNumSections(numSections+1)
 // setClasses([...classes, classToModify])
}

function submit(e) {
  // creates shallow copy of classes data
  let classData = [...classes];
  e.preventDefault();
  let objectToSend={student:studentName,
  courses:classData}
  console.log("you are about to send over", objectToSend);

  const requestBody = JSON.stringify(objectToSend);
  const apiEndpoint = 'http://localhost:3001/gradecalc/addclass';

  // calls api
  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  })
    .then((response) => response.json())
    .then((data) => {
      // logs data and message in console
      console.log('Data sent successfully:', data);
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
            <button type="button" onClick={() => addSection(courseIndex)}>Add Section</button>
            <div id="finalgrade" className="final-grade">Final Grade</div>
            {
              // want to continually monitor for updates to re-render the input assignments
              // problem: it does not update as you go
            }
            {input.sections.map((section, sectionIndex) => {
            return (
              <div className='section-name'>
                <input
                  className="section-input"
                  name='section'
                  placeholder='Section Name'
                  value={section.section}
                  onChange={(event) => handleCourseChange(courseIndex, sectionIndex, event)}
                />
                <input
                  className="weight-input"
                  name='weight'
                  placeholder='Section Weight (%)'
                  value={section.weight}
                  onChange={(event) => handleCourseChange(courseIndex, sectionIndex, event)}
                />
                <input
                  className="grades-input"
                  name='grades'
                  placeholder='Section Grades'
                  value={section.grades}
                  onChange={(event) => handleCourseChange(courseIndex, sectionIndex, event)}
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
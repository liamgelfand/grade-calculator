import React, {useEffect} from "react";
import "./App.css";

export default function App() {
  const [numAssignments, setNumAssignments]=React.useState(0)
  const [classes, setClasses]=React.useState([{name:'', assignments:[{type:'', weight:'', grade:''}]}])

const addClass = () => {
  let newClass = { name: '', assignments:[{type:'', weight:'', grade:''}]}
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

function submit (e) {
  let classData=[...classes]
  e.preventDefault();
  console.log("you are about to send over", classData)
}

 function addAssignment(courseIndex){
  let classData = [...classes];
  let classToModify=classData[courseIndex]
  let newAssignment={type:'', weight:'', grade:''}  
  classToModify.assignments.push(newAssignment)
  setNumAssignments(numAssignments+1)
 // setClasses([...classes, classToModify])
}


  return (
    <div className="large-box">
        <h1 className="title"> Grade Calculator</h1>



        <div className="add-class-container">
          <p className="add-class-text">Add Class</p>
          <button className="add-class-button" onClick={addClass} label="Add Class">+</button>

        </div>
        <form onSubmit={(e)=>submit(e)}>
        {classes.map((input, courseIndex) => {
          return (
            <div key={courseIndex} className='course'>
              <input
                name='name'
                placeholder='Class Name'
                value={input.name}
                onChange={event=>handleCourseChange(courseIndex, null,event)}
              /> 
              <button type="button"onClick={()=>addAssignment(courseIndex)}>Add Assignment</button>        
{
//want to continually monitor for updates to re-render the input assignments
//problem: it does not update as you go
}
              {input.assignments.map((assignment, assignmentIndex)=>{
                return(
               <div className='assignments'>
               <input
                name='type'
                placeholder='Assignment Type'
                value={input.assignments.type}
                onChange={event=>handleCourseChange(courseIndex,assignmentIndex,  event)}
              /> 
              <input
              name='weight'
              placeholder='Assignment Weight'
              value={input.assignments.weight}
              onChange={event=>handleCourseChange(courseIndex, assignmentIndex, event)}
            /> 
            <input
            name='grade'
            placeholder='Assignment Grade'
            value={input.assignments.grade}
            onChange={event=>handleCourseChange(courseIndex,assignmentIndex, event)}
          /> 
                </div>        
                ) 
              })}  
                       </div>
          )
        })} 
        </form>
        <button type="submit" onClick={(e)=>submit(e)}>Submit</button>
    </div>
  )
}

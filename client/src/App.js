import React, {useEffect} from "react";
import "./App.css";
import axios from 'axios';


export default function App() {
  const [data, setData] = React.useState(null);
  //keep track of a variable data

 useEffect(() => {
   //fetch the data found from the server at localhost:3001/api
   //this webpage contains a welcome message we will save
    fetch("/api")
      .then((res) => res.json())
      //turn the result into a json object
      .then((data) => setData(data.message));
      //assign the data variable to whatever you just recieved from the back end
  }, []);

  function handleSubmit(event, formElement) {
    const formData = new FormData(formElement);
    event.preventDefault();
    var classObject = {};
    for (let prop of formData) {
      classObject[prop[0]] = prop[1];
    }
  
    // Send a POST request to the backend API
    axios
      .post('http://localhost:3001/class', classObject)
      .then(() => console.log('Class Created'))
      .catch(err => {
        console.error(err);
      });
  }

let classCounter = 0; // Global counter to keep track of the number of created classes
let sectionCounter = 0;
const maxClasses = 6; // Set the maximum number of classes allowed
const maxSections = 7;

function createNewClass() {
  if (classCounter >= maxClasses) {
    alert("You can't create more than 6 classes.");
    return;
  }
  const classContainer = document.querySelector(".class-container");
  const newForm = document.createElement("form"); // Change 'div' to 'form'
  newForm.classList.add('newForm');

  const inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.placeholder = "Class Name";
  inputBox.classList.add("class-name")

  const button = document.createElement("button");
  button.textContent = "Add Section";
  button.addEventListener('click', createNewSection); // Assign the 'createNewSection' function to the button click
  button.classList.add("add-section-button")
  // Append the elements to the newForm form
  newForm.appendChild(inputBox);
  newForm.appendChild(button);

  classContainer.appendChild(newForm);

  classCounter++; // Increment the class counter
}

function createNewSection(event) {
  if (sectionCounter >= maxClasses) {
    alert("You can't create more than 6 classes.");
    return;
  }

  event.preventDefault();
  const button = event.currentTarget;
  const form = button.parentNode;

  const inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.placeholder = "Section Name";
  inputBox.classList.add("section-name");
  form.insertBefore(inputBox, button.nextSibling);

  const inputDiv = document.createElement("div"); // Create a div to hold the side-by-side inputs
  inputDiv.classList.add("input-div");

  const inputBox2 = document.createElement("input");
  inputBox2.type = "text";
  inputBox2.placeholder = "Weight";
  inputBox2.classList.add("section-weight");
  inputDiv.appendChild(inputBox2); // Add the Section Weight input to the div

  const inputBox3 = document.createElement("input");
  inputBox3.type = "text";
  inputBox3.placeholder = "Section Grades";
  inputBox3.classList.add("section-grades");
  inputDiv.appendChild(inputBox3); // Add the Section Grades input to the div

    form.insertBefore(inputDiv, inputBox.nextSibling); // Insert the div after the Section Name input

  sectionCounter++;
}
  
  return (
    <div className="large-box">
        <p className="title"> Grade Calculator</p>
        <div className="add-class-container">
          <button className="add-class-button" onClick={createNewClass}>+</button>
          <p className="add-class-text">Add Class</p>
        </div>
        <div className="class-container">
          <button className="submit-button" onClick={(event) => handleSubmit(event, event.currentTarget.form)}>
            Calculate
          </button>
        </div>
    </div>
  )
}

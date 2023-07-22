const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

classes=[]

app.get("/api", (req, res) => {
  //the front end can fetch this data and display it for the user
    res.json({ message: "Welcome to My Form" });
  });

  app.post('/class', function(req, res) {
    //the back end recieves data from the user
    //whatever the user enters in the form and sends over will
    //be visibale in req.body
    const newClass = req.body  
    classes.push(newClass);
    console.log(classes);
    //look at the terminal to see a print statement of all of the classes the user has submitted
    //notice if you click submit a bunch of times with the same data, then the list will grow
  });

  
app.listen(PORT, () => {
  //start the server
    console.log(`Server listening on ${PORT}`);
  });
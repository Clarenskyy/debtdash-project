require("dotenv").config();

const express = require("express");

//creates an express app
const app = express();

//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.get("/", (request, response) => {
  response.json({ mssg: "Welcome to the app" });
});

// listen for request
app.listen(process.env.PORT, () => {
  console.log(`listening on port 4000!!`);
});

const express = require("express");

//creates an express app
const app = express();

//Routes
app.get("/", (request, response) => {
  response.json({ mssg: "Welcome to the app" });
});

// listen for request
app.listen(4000, () => {
  console.log(`listening on port 4000!!`);
});

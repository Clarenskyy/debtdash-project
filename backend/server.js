const express = require("express");

//creates an express app
const app = express();

// listen for request
app.listen(4000, () => {
  console.log(`listening on port 4000!!!`);
});

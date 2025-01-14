require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const debtRoutes = require("./routes/debtor");
const itemListRoutes = require("./routes/itemlist");
const debtlistRoutes = require("./routes/debt");
const userRoutes = require("./routes/user");
const path = require("path");

// Creates an Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/debt", debtRoutes);
app.use("/api/inventory", itemListRoutes);
app.use("/api/debtlist", debtlistRoutes);
app.use("/api/user", userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all handler to serve React's index.html for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `Connected to DB and listening on port ${process.env.PORT || 4001}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the app with an error code
  });

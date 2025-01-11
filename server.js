require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const debtRoutes = require("./routes/debtor");
const itemListRoutes = require("./routes/itemlist");
const debtlistRoutes = require("./routes/debt");
const userRoutes = require("./routes/user");

// Creates an Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/debt", debtRoutes);
app.use("/api/inventory", itemListRoutes);
app.use("/api/debtlist", debtlistRoutes);
app.use("/api/user", userRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 4001, () => {
      console.log(
        `Connected to DB and listening on port ${process.env.PORT || 4001}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the app with an error code
  });

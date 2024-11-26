// Main file
const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect("");

 
// Routes
app.use("/event", eventRoutes);
app.use("/", authRoutes);

// Server setup
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

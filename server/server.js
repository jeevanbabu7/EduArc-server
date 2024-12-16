import UserRouter from "./routes/user.route.js";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import json from "body-parser/lib/types/json.js";
dotenv.config();

const app = express();

app.use(express.json());
// Parse JSON objects in requests
app.use(bodyParser.json());

// Avoid CORS issues
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// MongoDB connection
const uri = "mongodb+srv://nivedkp001:nived%40123@cluster0.sfvd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  // Use environment variable
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
app.use("/api/user", UserRouter);

// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`App started on port ${PORT}`);
});
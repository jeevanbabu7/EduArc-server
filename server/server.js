import UserRouter from "./routes/user.route.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import ChatManager from "./ChatManager.js";
import chatRouter from "./routes/chat.route.js";
import courseRouter from "./routes/course.route.js";
import summaryRouter from "./routes/summary.route.js";
import fileRouter from "./routes/material.route.js";
dotenv.config();

const app = express();

app.use(express.json());
// Parse JSON objects in requests
app.use(bodyParser.json());

// Avoid CORS issues
app.use(
  cors({
    origin: "*",
  })
);
// console.log(process.env.MONGO_URL);

// MongoDB connection  // Use environment variable
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  console.log(mongoose.modelNames());

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Use specific origin for production
},
});

const chatManager = new ChatManager();
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  chatManager.createChatSession(socket);

});

// Routes
app.use("/api/auth", UserRouter);
app.use("/api/chat", chatRouter);
app.use("/api/course", courseRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/material', fileRouter);

// Listen to port
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`App started on port ${PORT}`);
});
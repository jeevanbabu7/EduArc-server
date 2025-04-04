import express from "express";
import { addCourse, addMaterial, deleteMaterial, deleteCourse, getCourses } from "../controller/course.controller.js";

const Router = express.Router();
Router.post("/add-course", addCourse);
Router.post('/delete-course', deleteCourse);
Router.get('/get-courses/:userId', getCourses);

export default Router;
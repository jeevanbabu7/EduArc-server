import express from "express";
import { addCourse, addMaterial, deleteMaterial, deleteCourse } from "../controller/course.controller.js";

const Router = express.Router();
Router.post("/add-course", addCourse);
Router.post("/add-material", addMaterial);
Router.post('/delete-material', deleteMaterial);
Router.post('/delete-course', deleteCourse);
export default Router;
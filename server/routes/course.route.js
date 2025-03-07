import express from "express";
import { addCourse, addMaterial } from "../controller/course.controller.js";

const Router = express.Router();
Router.post("/add-course", addCourse);
Router.post("/add-material", addMaterial);
export default Router;
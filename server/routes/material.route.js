import express from "express";
import { addMaterial, deleteMaterial } from "../controller/material.controller.js";
import { getMaterials } from "../controller/material.controller.js";
const Router = express.Router();

Router.post("/add-material", addMaterial);
Router.post('/delete-material', deleteMaterial);
Router.get('/get-materials/:courseId', getMaterials);
export default Router;
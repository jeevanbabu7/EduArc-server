import express from "express";
import { createNewUser } from "../controller/auth.controller.js";
const Router = express.Router();


Router.post("/newUser", createNewUser);

export default Router;
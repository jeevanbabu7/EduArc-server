import express from "express";
import { SignIn, SignUp } from "../controller/auth.controller.js";
const Router = express.Router();


Router.post('/sign-in',SignIn);
Router.post('/sign-up',SignUp);

export default Router;
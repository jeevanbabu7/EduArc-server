import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createNewUser = async (req, res) => {
    console.log("Hii")
    const {name, userId, email, password, phone, age, favSubjects} = req.body;
    try {
        const newUser = new User({
            name,
            userId,
            email,
            password,
        });
        await newUser.save();
        res.status(201).json(newUser);
        
    }catch(err) {
        res.status(500).json({message: err.message});
    }
}

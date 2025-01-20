import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const SignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findOne({ email });

        if (!existing) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existing.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ result: existing });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const SignUp = async (req, res) => {
    const { name, email, password, class_ } = req.body;
 
    

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({ name, email, password: hashedPassword, class: class_ });
        res.status(201).json({ success: true, result }); 
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}



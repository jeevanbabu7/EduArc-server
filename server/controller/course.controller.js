import Course from "../models/course.js";
import Material from "../models/files.js";

export const addCourse = async (req, res) => {
    const { name, userId } = req.body;
    console.log(name, userId);
    
    try {
        const newCourse = new Course({ name, userId });
        await newCourse.save();
        res.status(201).json({ course: newCourse });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteCourse = async (req, res) => {
    const { courseId } = req.body;
    console.log("hhhhhhhhhhh");
    
    try {
        await Course.findByIdAndDelete(courseId);
        res.status(201).json({ message: "Course deleted successfully" });
    }catch(err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

export const addMaterial = async (req, res) => {
    const { name, courseId, contentURLs } = req.body;
    try {
        const newMaterial = new Material({ name: name, url:contentURLs, type: "material" });
        await newMaterial.save();

        const course = await Course.findById(courseId);
        course.materials.push(newMaterial._id);
        await course.save();
        res.status(201).json({ course });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteMaterial = async (req, res) => {
    const { courseId, materialId } = req.body;
    try {
        await Material.findByIdAndDelete(materialId);
        const course = await Course.findById(courseId);
        course.materials = course.materials.filter(material => material != materialId);
        await course.save();
        res.status(201).json({ course });
    }catch(err) {
        console.log(err);
        res.status(400).json({ err });
    }
}


export const getCourses = async (req, res) => {
    try{
        const { userId } = req.params;
        console.log(userId);
        
        const courses = await Course.find({userId: userId});
        res.status(200).json({ courses });

    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}
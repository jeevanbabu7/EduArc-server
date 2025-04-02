import Course from "../models/course.js";
import Files from "../models/files.js";
import Material from "../models/material.model.js";

export const addMaterial = async (req, res) => {
    const { courseId, title, files } = req.body;
        
    try {
        // Validate inputs
        if (!courseId || !title || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: "Invalid input. Course ID, title and files are required." });
        }
        
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        const newMaterial = new Material({ title });
        await newMaterial.save();
        
        // console.log("Files to process:", JSON.stringify(files, null, 2));
        
        await Promise.all(files.map(async (file, index) => {
            // Log each file object to see the structure
            // console.log(`Processing file ${index}:`, file);
            
            // Validate file object has required properties
            if (!file.name && !file.fileName) {
                throw new Error(`File at index ${index} is missing fileName/name property`);
            }
            
            if (!file.url && !file.fileUrl) {
                throw new Error(`File at index ${index} is missing fileUrl/url property`);
            }
            
            // Use the correct property names (try both possible formats)
            const fileName = file.fileName || file.name;
            const fileUrl = file.fileUrl || file.url;
            const fileSize = file.fileSize || file.size || "0";
            
            console.log(`Creating Files document with: fileName=${fileName}, fileUrl=${fileUrl}, fileSize=${fileSize}`);
            
            const newFile = new Files({
                fileName,
                fileUrl,
                fileSize,
                type: "material"
            });
            
            await newFile.save();
            newMaterial.fileUrls.push(newFile._id);
        }));
        
        // Save material changes
        await newMaterial.save();
        
        course.materials.push(newMaterial._id);
        await course.save();
        
        res.status(201).json({ 
            message: "Material added successfully",
            materialId: newMaterial._id,
            course 
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error", error: err.message});
    }
}

export const deleteMaterial = async (req, res) => {
    const { courseId, materialId } = req.body;
    
    try {
        // Validate inputs
        if (!courseId || !materialId) {
            return res.status(400).json({ message: "Course ID and Material ID are required" });
        }
        
        // Find the material first
        const material = await Material.findById(materialId);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        
        // Delete all associated files
        if (material.fileUrls && material.fileUrls.length > 0) {
            await Files.deleteMany({ _id: { $in: material.fileUrls } });
        }
        
        // Update the course to remove reference to this material
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }   
        
        course.materials = course.materials.filter(item => item.toString() !== materialId);
        await course.save();
        
        // Delete the material itself
        await Material.findByIdAndDelete(materialId);
        
        res.status(200).json({ 
            message: "Material deleted successfully",
            course 
        });
    } catch(err) {
        console.error("Error deleting material:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getMaterials = async (req, res) => {
    const { courseId } = req.params;
    console.log("hiiiii");
    
    try {
        const course = await Course.findById(courseId)
            .populate({
                path: 'materials',
                populate: {
                    path: 'fileUrls',
                    model: 'Files' // Ensure this is correct
                }
            })
            .exec();
        
        res.status(200).json({ materials: course });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

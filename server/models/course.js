import mongoose from "mongoose";
import Material from "./material.model.js";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    userId: {
        type: String
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material'
    }],
    pyq: [String],
    quiz: [String]
}, { timestamps: true });

// Middleware to delete related materials
courseSchema.pre('findOneAndDelete', async function(next) {
    try {
        const course = await this.model.findOne(this.getFilter());
        if (course) {
            await Material.deleteMany({ _id: { $in: course.materials } });
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;

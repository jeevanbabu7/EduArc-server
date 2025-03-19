import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    materials: {
        type: [String]
    },
    pyq: {
        type: [String]
    },
    quiz: {
        type: [String]
    }
}, {timestamps: true});


const Course = mongoose.model('Course', courseSchema);
export default Course;
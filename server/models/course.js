import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    userId: {
        type: String
    },
    materials: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material'
        }]
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
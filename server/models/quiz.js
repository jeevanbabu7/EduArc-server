import mongoose from "mongoose";
const quizSchema = new mongoose.Schema({
    questions: [String]
}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [String],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const Question = mongoose.model('Question', questionSchema);

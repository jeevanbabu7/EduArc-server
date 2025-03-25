import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true  
    },
    title: String,
    summary: [
        {
            title: {
                type: String,
                required: true
            },
            content: {
                type: [String],
                required: true
            }
        }
    ]
}, {timestamps: true});

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;
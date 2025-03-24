import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        // required: true

    },
    type: {
        type: String,
        enum: ['material', 'pyq'],
    }
}, {timestamps: true});


const Files = mongoose.model('Files', materialSchema);
export default Files;
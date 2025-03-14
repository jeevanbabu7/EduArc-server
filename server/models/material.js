import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        enum: ['material', 'pyq'],
    }
}, {timestamps: true});


const Material = mongoose.model('Material', materialSchema);
export default Material;
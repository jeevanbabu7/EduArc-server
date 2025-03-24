import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileUrls: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Files'
        }],
        required: true
    },
    
}, {timestamps: true});


const Material = mongoose.model('Material', materialSchema);
export default Material;
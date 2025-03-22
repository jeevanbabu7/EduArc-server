import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    },
    favSubjects: {
        type: [String],

    }
}, {timestamps: true});


const User = mongoose.model('User', userSchema);
export default User;
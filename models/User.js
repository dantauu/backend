import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
}, 
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', UserSchema)

export default UserModel;
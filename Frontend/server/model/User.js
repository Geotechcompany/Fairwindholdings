import mongoose from "mongoose";
import crypto from 'crypto'

const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,  // Trim whitespace for consistency
        minlength: 3,  // Enforce a minimum length
        maxlength: 30  // Enforce a maximum length
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,  // Enforce lowercase for normalization
        match: /.+\@.+\..+/  // Validate email format
    },
    password: {
        type: String,
        required: true,
        minlength: 6  // Enforce a minimum password length
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationHash: {
        type: String,
        default: ''
    },
    loginVerificationCode: {
        type: String,
        default: ''
    },
    plan: {
        type: String,
        required: true,
        default: 'free'
    },
    project: {
        type: String,
        required: true, 
    },
    requests: {
        type: Number,
        default: 0
    },
    role: {
        type: String
    }
    

})

UserSchema.methods.generateVerificationHash = function () {
    this.verificationHash = crypto.randomBytes(64).toString('hex');
};


const User = mongoose.model('User', UserSchema)

export default User
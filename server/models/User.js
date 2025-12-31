import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastPasswordChange: {
        type: Date,
        default: null
    },
    avatar: {
        type: String,
        default: null
    }
});

export default mongoose.model('User', UserSchema);

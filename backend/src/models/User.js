import { parse } from "dotenv";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    hashedPassword: {
        type: String,
        required: true,
    },

    displayName: {
        type: String,
        required: true,
        trim: true,
    },

    avatarUrl: {
        type: String, // Lưu link CDN của ảnh đại diện
        trim: true,
    },

    avtarId: {
        type: String, // Lưu Cloudinary public_id để dễ xóa ảnh
        trim: true,
    },

    bio: {
        type: String,
        maxlength: 500,
    },

    phone: {
        type: String,
        sparse: true, // cho phép null nhưng không được trùng
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
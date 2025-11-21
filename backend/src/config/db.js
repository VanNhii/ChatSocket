import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log("DEBUG MONGODB_URI:", process.env.MONGODB_URI);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối đến MongoDB thành công');
    } catch (error) {
        console.error('Lỗi kết nối đến MongoDB:', error);  
        process.exit(1);
    }
}
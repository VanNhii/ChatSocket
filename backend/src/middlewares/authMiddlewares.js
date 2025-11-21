import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization middleware xác minh User đó là ai thông qua JWT
export const protectRoute = (req, res, next) => {
    try {
    // Lấy token client gửi lên từ Header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
   
        if (!token) {
            return res.status(401).json({mesage: "Không tìm thấy Access Token, vui lòng đăng nhập"});
        }
     // xác thực token hợp lệ hay không
     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({mesage: "Access Token không hợp lệ, vui lòng đăng nhập lại"});
        }
         // Hợp lệ thì tìm user tương ứng trong db để chắc chắn tài khoản là thật và chưa bị xoá
        const user = await User.findById(decoded.userId).select('-hashPassword');  
        if (!user) {
            return res.status(401).json({mesage: "Người dùng không tồn tại, vui lòng đăng nhập lại"});
        }
        
        // Tìm thấy User thì gắn và req để các middleware sau sử dụng
        req.user = user; // gắn user vào req để các middleware sau sử dụng
        next(); // cho phép đi tiếp
        });

    } catch (error) {
        console.error("Lỗi xác minh JWT trong authMiddlewares:", error);
        return res.status(500).json({mesage: "Lỗi máy chủ, vui lòng thử lại sau"});
    }
}
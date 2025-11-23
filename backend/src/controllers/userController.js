export const authMe = async (req, res) => {
    try {
        const user = req.user; // Lấy user từ middleware bảo vệ route
        return res.status(200).json({mesage: "Lấy thông tin user thành công", user});
    } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
        console.error(error.stack);
        return res.status(500).json({message: "Lỗi máy chủ, vui lòng thử lại sau"});
    }
}
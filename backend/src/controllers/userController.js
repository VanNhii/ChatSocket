export const authMe = async (req, res) => {
    try {
        return res.status(200).json({mesage: "Lấy thông tin user thành công", user: req.user});
    } catch (error) {
        
    }
}
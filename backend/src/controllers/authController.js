import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // tính số mili giây cho 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    if (!username || !email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra xem đã tồn tại user chưa
    const duplicateUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (duplicateUser) {
      return res
        .status(409)
        .json({ message: "Username hoặc email đã tồn tại" });
    }
    // Chưa có user thì mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10); //salt = 10
    // Ở đây password đã được mã hoá bằng bcrypt trộn với salt 10 lần
    // Ở đây mã hoá 2 mũ 10 lần

    // Tạo user mới

    await User.create({
      username,
      email,
      hashedPassword,
      displayName: `${firstName} ${lastName}`,
    });
    // Return response về lai

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi đăng ký tài khoản:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};

export const signIn = async (req, res) => {
  try {
    // Láy input từ req.body
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "vui lòng nhập đầy đủ Username và Password" });
    }
    // Lấy hashedPassword từ db theo username

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }
    // Kiểm tra password có khớp với hashedPassword không

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }
    // Nếu khớp tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Tạo session lưu refreshToken vào db
    
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    // Gửi refreshToken về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // không được truy cập bởi JS phía client
      secure: true, // Chỉ gửi cookie qua HTTPS trong môi trường production
      sameSite: "none", // Cho phép deploy backend và frontend riêng còn strict thì deploy cùng 1 nguồn
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả về accessToken cho client qua res

    return res
      .status(200)
      .json({
        message: `User ${user.displayName} đã đăng nhập thành công`,
        accessToken,
      });
  } catch (error) {
    console.error("Lỗi đăng nhập - SignIn:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};

export const signOut = async (req, res) => {
  try {
    // Láy refreshToken từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
    // Xoá refreshToken từ trong session
      await Session.deleteOne({refreshToken: token});
    // Xoá cookie trên trình duyệt
      res.clearCookie("refreshToken")
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi đăng nhập - SignIn:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};

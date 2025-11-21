import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middlewares/authMiddlewares.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cookieParser());

//public routes
app.use("/api/auth", authRoute);


//private routes
app.use(protectRoute)
app.use("/api/users", userRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đã chạy trên cổng ${PORT}`);
  });
});

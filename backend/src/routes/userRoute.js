import expres from "express";
import { authMe } from "../controllers/userController.js";

const router = expres.Router();

router.get('/me', authMe);
export default router;
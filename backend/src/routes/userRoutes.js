import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { validateUserRegister, validateUserLogin } from "../middleware/validationMiddleware.js";

const router = express.Router();
router.post("/register", validateUserRegister, registerUser);
router.post("/login", validateUserLogin, loginUser);

export default router;
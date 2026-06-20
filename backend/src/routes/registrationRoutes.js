import express from "express";
import { registerForEvent, getMyRegistrations } from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRegistrationInput } from "../middleware/validationMiddleware.js";

const router = express.Router();
router.get("/my", protect, getMyRegistrations);
router.post("/", protect, validateRegistrationInput, registerForEvent);

export default router;
import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validateIdParam, validateEventInput } from "../middleware/validationMiddleware.js";

const router = express.Router();
router.get("/", getEvents);
router.get("/analytics", getEventAnalytics);
router.get("/:id", validateIdParam("id"), getEventById);
router.post("/", protect, adminOnly, validateEventInput, createEvent);
router.put("/:id", protect, adminOnly, validateIdParam("id"), validateEventInput, updateEvent);
router.delete("/:id", protect, adminOnly, validateIdParam("id"), deleteEvent);

export default router;
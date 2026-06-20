import asyncHandler from "express-async-handler";
import Registration from "../models/Registration.js";

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = asyncHandler(async (req, res) => {
  console.log("Registration Request Body:", req.body);
  const { eventId, studentName, studentEmail, studentPhone } = req.body;

  if (!eventId || !studentName || !studentEmail || !studentPhone) {
    res.status(400);
    throw new Error("All fields (Event ID, Name, Email, Phone) are required");
  }

  // Check if already registered
  const existingRegistration = await Registration.findOne({
    event: eventId,
    studentEmail: studentEmail,
  });

  if (existingRegistration) {
    res.status(400);
    throw new Error("You have already registered for this event with this email.");
  }

  const registration = await Registration.create({
    user: req.user._id, // Strictly link logged-in user
    event: eventId,
    studentName,
    studentEmail,
    studentPhone,
  });

  // Populate event and return
  const populated = await Registration.findById(registration._id).populate({
    path: "event",
    populate: { path: "createdBy", select: "name email" },
  });

  res.status(201).json(populated);
});

// @desc    Get user's registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate({
      path: "event",
      populate: { path: "createdBy", select: "name email" },
    });
  res.json(registrations);
});
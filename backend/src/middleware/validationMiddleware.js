import mongoose from "mongoose";

// Validate MongoDB ObjectId parameter
export const validateIdParam = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return next(new Error(`Invalid ID format for parameter: ${paramName}`));
    }
    next();
  };
};

// Validate user registration body parameters
export const validateUserRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    res.status(400);
    return next(new Error("Please provide a valid name (minimum 2 characters)"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400);
    return next(new Error("Please provide a valid email address"));
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    res.status(400);
    return next(new Error("Password must be at least 6 characters long"));
  }

  next();
};

// Validate user login parameters
export const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("Email and password are required"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error("Please provide a valid email address"));
  }

  next();
};

// Validate event creation/update parameters
export const validateEventInput = (req, res, next) => {
  const { title, description, date, venue } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    res.status(400);
    return next(new Error("Title is required (minimum 3 characters)"));
  }

  if (!description || typeof description !== "string" || description.trim().length < 5) {
    res.status(400);
    return next(new Error("Description is required (minimum 5 characters)"));
  }

  if (!date || isNaN(Date.parse(date))) {
    res.status(400);
    return next(new Error("Please provide a valid date and time"));
  }

  if (new Date(date) < new Date()) {
    res.status(400);
    return next(new Error("Event date must be in the future"));
  }

  if (!venue || typeof venue !== "string" || venue.trim().length < 2) {
    res.status(400);
    return next(new Error("Venue is required (minimum 2 characters)"));
  }

  next();
};

// Validate event registration parameters
export const validateRegistrationInput = (req, res, next) => {
  const { eventId, studentName, studentEmail, studentPhone } = req.body;

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400);
    return next(new Error("A valid Event ID is required"));
  }

  if (!studentName || typeof studentName !== "string" || studentName.trim().length < 2) {
    res.status(400);
    return next(new Error("Student name is required (minimum 2 characters)"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!studentEmail || !emailRegex.test(studentEmail)) {
    res.status(400);
    return next(new Error("Please provide a valid email address"));
  }

  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  if (!studentPhone || !phoneRegex.test(studentPhone.replace(/[\s-()]/g, ""))) {
    res.status(400);
    return next(new Error("Please provide a valid phone number (10-15 digits)"));
  }

  next();
};

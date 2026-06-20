import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("createdBy", "name email");
  res.json(events);
});

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("createdBy", "name email");

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue } = req.body;

  if (!title || !date || !venue) {
    res.status(400);
    throw new Error("Please provide title, date, and venue");
  }

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    createdBy: req.user._id,
  });

  res.status(201).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.venue = venue || event.venue;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    // Cascade delete associated registrations
    await Registration.deleteMany({ event: req.params.id });
    await event.deleteOne();
    res.json({ message: "Event and associated registrations removed" });
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Get event analytics using aggregation
// @route   GET /api/events/analytics
// @access  Public
export const getEventAnalytics = asyncHandler(async (req, res) => {
  const stats = await Event.aggregate([
    {
      $lookup: {
        from: "registrations",
        localField: "_id",
        foreignField: "event",
        as: "registrations",
      },
    },
    {
      $addFields: {
        registrationCount: { $size: "$registrations" },
      },
    },
    {
      $group: {
        _id: "$venue",
        totalEvents: { $sum: 1 },
        avgRegistrations: { $avg: "$registrationCount" },
        events: { $push: { title: "$title", count: "$registrationCount" } },
      },
    },
    {
      $project: {
        _id: 0,
        venue: "$_id",
        totalEvents: 1,
        avgRegistrations: { $round: ["$avgRegistrations", 2] },
        events: 1,
      },
    },
    { $sort: { avgRegistrations: -1 } },
  ]);

  res.json(stats);
});
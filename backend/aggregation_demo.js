import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./src/models/Event.js";
import Registration from "./src/models/Registration.js";

dotenv.config();

const runDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Add a new event (The "addone new event" part)
    const newEvent = await Event.create({
      title: "Annual Tech Summit 2026",
      description: "A grand gathering of tech enthusiasts and innovators.",
      date: new Date("2026-10-15"),
      venue: "Main Auditorium",
    });
    console.log(`Created new event: ${newEvent.title}`);

    // Add some mock registrations for this event to make aggregation interesting
    const timestamp = Date.now();
    try {
      await Registration.insertMany([
        { event: newEvent._id, studentName: "Alice Smith", studentEmail: `alice_${timestamp}@example.com`, studentPhone: "1234567890" },
        { event: newEvent._id, studentName: "Bob Jones", studentEmail: `bob_${timestamp}@example.com`, studentPhone: "0987654321" },
      ]);
      console.log("Added mock registrations for the event.");
    } catch (regError) {
      console.log("Some registrations might have already existed or failed, continuing to aggregation...");
    }

    console.log("\n--- RUNNING MONGODB AGGREGATION PIPELINE ---\n");

    // 2. Complex Aggregation using major aggregate functions
    const analytics = await Event.aggregate([
      // Stage 1: $lookup - Join with registrations collection
      {
        $lookup: {
          from: "registrations",      // collection name in MongoDB
          localField: "_id",
          foreignField: "event",
          as: "registrations"
        }
      },

      // Stage 2: $addFields - Add a field for registration count
      {
        $addFields: {
          registrationCount: { $size: "$registrations" }
        }
      },

      // Stage 3: $match - Filter events with at least one registration
      { $match: { registrationCount: { $gt: 0 } } },

      // Stage 4: $group - Group by venue to see stats
      {
        $group: {
          _id: "$venue",
          totalEvents: { $sum: 1 },
          avgRegistrations: { $avg: "$registrationCount" },
          allTitles: { $push: "$title" }
        }
      },

      // Stage 5: $project - Shape the final output
      {
        $project: {
          _id: 0,
          venue: "$_id",
          totalEvents: 1,
          avgRegistrations: { $round: ["$avgRegistrations", 2] },
          eventTitles: "$allTitles"
        }
      },

      // Stage 6: $sort - Sort by average registrations descending
      { $sort: { avgRegistrations: -1 } }
    ]);

    console.log("Aggregation Result (Venue Stats):");
    console.log(JSON.stringify(analytics, null, 2));

    // Stage 7: Using $facet for multiple perspectives
    const multiPerspective = await Event.aggregate([
      {
        $facet: {
          "ByVenue": [
            { $group: { _id: "$venue", count: { $sum: 1 } } }
          ],
          "UpcomingEvents": [
            { $match: { date: { $gte: new Date() } } },
            { $sort: { date: 1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    console.log("\nAggregation Result (Facets - Multi-view):");
    console.log(JSON.stringify(multiPerspective, null, 2));

    process.exit();
  } catch (error) {
    console.error("Error running demo:", error);
    process.exit(1);
  }
};

runDemo();

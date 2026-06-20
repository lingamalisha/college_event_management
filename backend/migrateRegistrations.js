import mongoose from "mongoose";
import dotenv from "dotenv";
import Registration from "./src/models/Registration.js";
import User from "./src/models/User.js";

// Load environment variables
dotenv.config();

const migrateRegistrations = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is not defined in the environment.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    // Find registrations with user = null or user field missing
    const orphanedRegistrations = await Registration.find({
      $or: [{ user: null }, { user: { $exists: false } }],
    });

    console.log(`Found ${orphanedRegistrations.length} registration(s) with null/missing user reference.`);

    if (orphanedRegistrations.length === 0) {
      console.log("No registrations require migration. Exiting.");
      process.exit(0);
    }

    let matchedCount = 0;
    let unmatchedCount = 0;

    for (const reg of orphanedRegistrations) {
      // Look for a user with the matching email (case-insensitive search)
      const user = await User.findOne({
        email: reg.studentEmail.toLowerCase().trim(),
      });

      if (user) {
        reg.user = user._id;
        await reg.save();
        console.log(`🔗 Linked registration [ID: ${reg._id}] for "${reg.studentName}" to User [ID: ${user._id}] (${user.email})`);
        matchedCount++;
      } else {
        console.log(`⚠️  Could not find user account matching email "${reg.studentEmail}" for registration [ID: ${reg._id}]`);
        unmatchedCount++;
      }
    }

    console.log("\n--- Migration Complete ---");
    console.log(`✅ Linked: ${matchedCount}`);
    console.log(`⚠️  Unmatched (no User account found): ${unmatchedCount}`);
    console.log("--------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed with error:", error.message);
    process.exit(1);
  }
};

migrateRegistrations();

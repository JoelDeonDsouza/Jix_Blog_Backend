import { Webhook } from "svix";
import { User } from "../models/userModel.js";

export const clerkWebhookHandler = async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }
  try {
    // Get the raw body - should be string/buffer, not parsed JSON //
    const payload = req.rawBody || req.body;
    const headers = req.headers;
    // Debug logging //
    console.log("Webhook payload type:", typeof payload);
    console.log("Headers received:", headers);
    const wh = new Webhook(webhookSecret);
    let event;
    try {
      event = wh.verify(payload, headers);
      console.log("Webhook verified successfully, event type:", event.type);
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      console.error("Payload:", payload);
      console.error("Headers:", headers);
      return res.status(400).json({
        message: "Webhook verification failed",
        error: err.message,
      });
    }

    // Handle the event //
    if (event.type === "user.created") {
      try {
        console.log("Processing user.created event for:", event.data.id);
        // Check if user already exists to avoid duplicates //
        const existingUser = await User.findOne({ clerkId: event.data.id });
        if (existingUser) {
          console.log("User already exists:", event.data.id);
          return res.status(200).json({
            message: "User already exists",
          });
        }
        // Extract user data with better fallbacks //
        const userData = {
          clerkId: event.data.id,
          username: getUsernameFromEvent(event.data),
          email: getEmailFromEvent(event.data),
          img: event.data.profile_image_url || event.data.image_url || "",
        };
        console.log("Creating user with data:", userData);
        // Create new user //
        const newUser = new User(userData);
        await newUser.save();
        console.log("User created successfully:", newUser._id);
        return res.status(200).json({
          message: "User created successfully",
          userId: newUser._id,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        console.error("Event data:", JSON.stringify(event.data, null, 2));
        return res.status(500).json({
          message: "Failed to create user",
          error: dbError.message,
        });
      }
    } else {
      console.log("Event received but not processed:", event.type);
      return res.status(200).json({
        message: "Event received but not processed",
        eventType: event.type,
      });
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Helper function to extract username //
function getUsernameFromEvent(eventData) {
  // Try username first //
  if (eventData.username) {
    return eventData.username;
  }
  // Try first and last name combination //
  if (eventData.first_name || eventData.last_name) {
    const firstName = eventData.first_name || "";
    const lastName = eventData.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) {
      return fullName;
    }
  }
  // Try email prefix //
  if (eventData.email_addresses && eventData.email_addresses[0]) {
    const email = eventData.email_addresses[0].email_address;
    return email.split("@")[0];
  }
  // Fallback to user ID //
  return `user_${eventData.id}`;
}

// Helper function to extract email //
function getEmailFromEvent(eventData) {
  if (
    eventData.email_addresses &&
    eventData.email_addresses.length > 0 &&
    eventData.email_addresses[0].email_address
  ) {
    return eventData.email_addresses[0].email_address;
  }
  return null;
}

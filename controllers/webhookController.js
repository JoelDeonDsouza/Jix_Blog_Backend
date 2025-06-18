import { Webhook } from "svix";
import { User } from "../models/userModel.js";

export const clerkWebhookHandler = async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }
  try {
    // Get the raw body as string for svix verification //
    const payload = req.body;
    const headers = req.headers;
    const wh = new Webhook(webhookSecret);
    let event;
    try {
      event = wh.verify(payload, headers);
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({
        message: "Webhook verification failed",
        error: err.message,
      });
    }
    // Handle the event //
    if (event.type === "user.created") {
      try {
        // Check if user already exists to avoid duplicates //
        const existingUser = await User.findOne({ clerkId: event.data.id });
        if (existingUser) {
          return res.status(200).json({
            message: "User already exists",
          });
        }
        // Create new user //
        const newUser = new User({
          clerkId: event.data.id,
          username:
            event.data.username ||
            (event.data.email_addresses && event.data.email_addresses[0]
              ? event.data.email_addresses[0].email_address
              : `user_${event.data.id}`),
          email:
            event.data.email_addresses && event.data.email_addresses[0]
              ? event.data.email_addresses[0].email_address
              : null,
          img: event.data.profile_image_url || event.data.image_url || "",
        });
        await newUser.save();
        return res.status(200).json({
          message: "User created successfully",
          userId: newUser._id,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({
          message: "Failed to create user",
          error: dbError.message,
        });
      }
    } else {
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

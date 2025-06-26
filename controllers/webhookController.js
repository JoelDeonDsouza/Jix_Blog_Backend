/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the webhook handler for Clerk webhooks in the Express application.
 * It processes incoming webhook events, verifies them using the Clerk Webhook library, and handles user creation events.
 * The handler checks for the existence of a user in the database before creating a new user.
 * It also includes helper functions to extract the username and email from the event data.
 * The module uses the Mongoose User model for database operations.
 * @version: 1.0.1
 * @date: 2025-06-26
 */


import { Webhook } from "svix";
import { User } from "../models/userModel.js";

export const clerkWebhookHandler = async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }
  try {
    const payload = Buffer.isBuffer(req.body) ? req.body.toString() : req.body;
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
        const existingUser = await User.findOne({ clerkUserId: event.data.id });
        if (existingUser) {
          return res.status(200).json({
            message: "User already exists",
          });
        }
        const userData = {
          clerkUserId: event.data.id,
          username: getUsernameFromEvent(event.data),
          email: getEmailFromEvent(event.data),
          img: event.data.profile_image_url || event.data.image_url || "",
        };
        // Create new user //
        const newUser = new User(userData);
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

// Helper function to extract username //
function getUsernameFromEvent(eventData) {
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
  if (eventData.email_addresses && eventData.email_addresses[0]) {
    const email = eventData.email_addresses[0].email_address;
    return email.split("@")[0];
  }
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

import { Webhook } from "svix";
import { User } from "../models/userModel.js";

export const clerkWebhookHandler = async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: "Webhook secret not configured" });
  }
  // Initialize the Webhook with the secret //
  const payload = req.body;
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);
  let event;
  try {
    event = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
  console.log(event.data);
  // Handle the event //
  if (event.type === "user.created") {
    const newUser = new User({
      clerkId: event.data.id,
      username:
        event.data.username || event.data.email_addresses[0].email_address,
      email: event.data.email_addresses[0].email_address,
      img: event.data.profile_image_url || "",
    });
    await newUser.save();
  }
  return res.status(200).json({
    message: "Webhook received and processed successfully",
  });
};

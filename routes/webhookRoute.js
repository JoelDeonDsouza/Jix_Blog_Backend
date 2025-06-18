import express from "express";
import { clerkWebhookHandler } from "../controllers/webhookController.js";

const router = express.Router();

// router.get("/clerk", (req, res) => {
//   res.json({ message: "Clerk webhook endpoint is reachable" });
// });

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookHandler
);

export default router;

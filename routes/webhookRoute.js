/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the routes for handling webhooks in the Express application.
 * It includes a route for processing Clerk webhooks, which are used for user authentication and management.
 * The route uses the `clerkWebhookHandler` controller to process incoming webhook events.
 * The webhook endpoint is configured to accept raw JSON payloads.
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import express from "express";
import { clerkWebhookHandler } from "../controllers/webhookController.js";

const router = express.Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookHandler
);

export default router;

import express from "express";
import bodyParser from "body-parser";
import { clerkWebhookHandler } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/clerk", bodyParser.raw({ type: 'application/json' }), clerkWebhookHandler);

export default router;

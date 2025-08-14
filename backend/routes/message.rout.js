import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Send a message to a user (receiverId is passed as :id)
router.post("/send/:id", isAuthenticated, sendMessage);

// Get all messages between the authenticated user and another user
router.get("/all/:id", isAuthenticated, getMessages);

export default router;

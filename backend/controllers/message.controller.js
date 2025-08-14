import Conversation from "../models/convesation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id; // From middleware
    const receiverId = req.params.id; // From route param
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty",
      });
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message.trim(),
    });

    // Add message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending message",
    });
  }
};
// Get Messages between two users

export const getMessages = async (req, res) => {
  try {
    const userId = req.id; // Authenticated user ID
    const otherUserId = req.params.id; // The user they're chatting with

    // Find conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    })

    if (!conversation) {
      return res.status(200).json({
        success: true,
        message: "No conversation found between the users",
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages: conversation.messages,
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages",
    });
  }
};


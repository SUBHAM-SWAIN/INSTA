import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getReels,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Create a post
router.post("/addPost", isAuthenticated, upload.single("image"), addNewPost);

// Get all posts
router.get("/all", isAuthenticated, getAllPost);

// Get posts of the authenticated user
router.get("/userpost/all", isAuthenticated, getUserPosts);

// Like / Dislike a post
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);

// Commenting
router.post("/:id/comment", isAuthenticated, addComment);
router.get("/:id/comments/all", isAuthenticated, getCommentsOfPost);

// Delete a post
router.post("/delete/:id", isAuthenticated, deletePost);

// Bookmark a post
router.post("/:id/bookmark", isAuthenticated, bookmarkPost);
// Get all reels (you can filter by type or tag or category)
router.get("/reels", isAuthenticated, getReels);

export default router;

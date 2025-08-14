import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Profile routes
router.get("/:id/profile", isAuthenticated, getProfile);
router.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);

// User actions
router.get("/suggested", isAuthenticated, getSuggestedUsers);
router.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);

export default router;

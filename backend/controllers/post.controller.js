import sharp from "sharp";

import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id; // Assuming req.id contains the ID of the authenticated user

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url, // Assuming the field in Post model is 'image'
      author: authorId,
    });
    const user = await User.findById(authorId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.posts.push(post._id);
    await user.save();

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id; // Authenticated user ID from middleware

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 }) // Newest posts first
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comment",
        options: { sort: { createdAt: -1 } }, // Sort comments inside post
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your posts",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id; // Post ID from request parameters
    const userId = req.id; // Authenticated user ID from middleware

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    //like logic
    await post.updateOne({ $addToSet: { like: userId } });
    await post.save();
    //socet io logic

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id; // Post ID from request parameters
    const userId = req.id; // Authenticated user ID from middleware

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    //dislike logic
    await post.updateOne({ $pull: { like: userId } });
    await post.save();
    //socet io logic

    return res.status(200).json({
      success: true,
      message: "Post Disliked",
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id; // Post ID from URL
    const userId = req.id; // Authenticated user ID
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      text: text.trim(),
      author: userId,
      post: postId,
    }).populate({ path: "author", select: "username profilePicture" });

    // Add comment ID to post
    post.comment.push(comment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding comment",
    });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Optional: check if post exists

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }) // Newest first
      .populate({ path: "author", select: "username profilePicture" });

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "No comments found for this post",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching comments",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    // Remove post ID from the user's posts array
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post",
    });
  }
};

//bookMark post

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id; // Post ID
    const userId = req.id; // Authenticated User ID

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(userId);

    const isBookmarked = user.bookmarks.includes(postId);

    if (isBookmarked) {
      // Remove from bookmarks
      await user.updateOne({ $pull: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post removed from bookmarks",
      });
    } else {
      // Add to bookmarks
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post bookmarked successfully",
      });
    }
  } catch (error) {
    console.error("Error bookmarking post:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while bookmarking post",
    });
  }
};
export const getReels = async (req, res) => {
  try {
    // Example: assuming 'reel' posts are marked with a type
    const reels = await Post.find({ type: "reel" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reels" });
  }
};

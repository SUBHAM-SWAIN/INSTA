import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "something Is Missing ,please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "Try With Different e-mail",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account Created Success Fully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "something Is Missing ,please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect Email or password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
  expiresIn: "1d",
});


    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.toString() === user._id.toString()) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    // If profile picture is provided, upload to Cloudinary
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update fields only if provided
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({
      message: "An error occurred while updating profile",
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(404).json({
        message: "No users found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id;
    const jiskoFollowkarunga = req.params.id;
    if (followKarneWala === jiskoFollowkarunga) {
      return res.status(400).json({
        message: "You can not follow or unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowkarunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskoFollowkarunga);

    if (isFollowing) {
      //UnFollow Logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jiskoFollowkarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowkarunga },
          { $pull: { followers: followKarneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed Successfully", success: true });
    } else {
      //Follow Logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jiskoFollowkarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowkarunga },
          { $push: { followers: followKarneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

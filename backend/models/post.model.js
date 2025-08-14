import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  image: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  like: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  comment: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true }); // Optional: adds createdAt and updatedAt

const Post = mongoose.model("Post", postSchema);
export default Post;

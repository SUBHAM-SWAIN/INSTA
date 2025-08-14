import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import CommentDialog from "./CommentDialog";

function Posts({ post }) {
  const { author, image, caption } = post;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.like?.length || 0);
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      console.log("Comment:", comment);
      setComment("");
    }
  };

  const handleEdit = () => alert("Edit Post clicked");
  const handleDelete = () => alert("Delete Post clicked");
  const handleReport = () => alert("Report Post clicked");

  const postData = {
    id: post._id,
    username: author?.username,
    profilePic: author?.profilePic || "/default-avatar.png",
    title: caption,
    content: caption,
    image: image,
    comments: [
      {
        text: "Nice shot!",
        user: {
          username: "john_doe",
          profilePic: "https://i.pravatar.cc/150?img=3",
        },
      },
      {
        text: "Love this!",
        user: {
          username: "jane_doe",
          profilePic: "https://i.pravatar.cc/150?img=4",
        },
      },
    ],
  };

  return (
    <div className="w-full border-b border-gray-200 pb-4 relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-inner">
        <div className="flex items-center space-x-3">
          <img
            src={author?.profilePicture || "/default-avatar.png"}
            alt={`${author?.username}'s profile`}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-medium">@{author?.username}</span>
        </div>
        <div className="relative" ref={menuRef}>
          <MoreHorizontal
            className="cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-2 top-8 bg-white rounded-xl shadow-lg border w-48 z-50 text-center">
              <button
                onClick={handleReport}
                className="w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
              >
                Report
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-3 text-sm font-semibold hover:bg-gray-100 border-b"
              >
                Delete Post
              </button>
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-sm hover:bg-gray-100"
              >
                Edit Post
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-black">
        <img
          src={image}
          alt="Post"
          className="w-full max-h-[500px] object-cover"
        />
      </div>

      <div className="flex flex-col justify-between border-t border-gray-200 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Heart
              onClick={handleLike}
              className={`cursor-pointer transition-transform duration-150 ${
                liked ? "text-red-500 fill-red-500 scale-110" : ""
              }`}
            />
            <MessageCircle
              className="cursor-pointer"
              onClick={() => setShowDialog(true)}
            />
            <Send className="cursor-pointer" />
          </div>
          <Bookmark className="cursor-pointer" />
        </div>

        <div className="px-4 space-y-1">
          <p className="text-sm font-semibold">{likes} likes</p>
          <p className="text-sm">
            <span className="font-semibold mr-1">@{author?.username}</span>
            {caption}
          </p>
        </div>

        <div className="px-4 py-1">
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={() => setShowDialog(true)}
          >
            See all comments
          </button>
        </div>

        <div className="px-4">
          <div className="border-t border-gray-300 flex items-center">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full py-2 text-sm placeholder-gray-400 focus:outline-none"
            />
            {comment.trim() && (
              <button
                onClick={handleCommentSubmit}
                className="ml-2 text-blue-500 font-medium text-sm hover:underline"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>

      {showDialog && (
        <CommentDialog post={postData} onClose={() => setShowDialog(false)} />
      )}
    </div>
  );
}

export default Posts;

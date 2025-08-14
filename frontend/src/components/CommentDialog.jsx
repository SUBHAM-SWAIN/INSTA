import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const CommentDialog = ({ post, onClose }) => {
  const dialogRef = useRef(null);
  const [comment, setComment] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handlePostComment = () => {
    if (comment.trim()) {
      console.log('New comment:', comment);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[70vh] flex flex-col md:flex-row overflow-hidden"
      >
        {/* Post Image */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Right Side - Post Info + Comments */}
        <div className="w-full md:w-1/2 h-full flex flex-col">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <img
                src={post.profilePic}
                alt="Author"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold">{post.username}</p>
            </div>
            <div className="relative">
              <MoreHorizontal
                className="cursor-pointer"
                onClick={() => setShowOptions((prev) => !prev)}
              />
              {showOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-[10000]">
                  <button
                    onClick={() => alert('Unfollow clicked')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Unfollow
                  </button>
                  <button
                    onClick={() => alert('Added to favorites')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Add to favorites
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Scrollable Section */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <img
                  src={comment.user.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{comment.user.username}</p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="border-t p-4 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border rounded-lg p-2 focus:outline-none"
            />
            {comment.trim() && (
              <button
                onClick={handlePostComment}
                className="text-blue-500 font-medium text-sm hover:underline"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;

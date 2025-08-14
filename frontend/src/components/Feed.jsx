import React, { useEffect, useState } from "react";
import axios from "axios";
import Posts from "./Posts";

function Feed({ onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        setPosts(res.data.posts);
        console.log("Fetched posts:", res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading posts...</p>;

  return (
    <div className="flex-1 py-0 flex flex-col items-center gap-1">
      <div className="w-full max-w-md">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Posts key={post._id} post={post} onCommentClick={() => onPostClick(post)} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No posts available</p>
        )}
      </div>
    </div>
  );
}

export default Feed;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

function MobileTopBar() {
  const navigate = useNavigate();

  return (
    <div className="md:hidden w-full bg-white border-b border-gray-300 p-3 flex justify-between items-center fixed top-0 z-30">
      <h1
        className="text-xl font-bold text-pink-600 font-sans cursor-pointer select-none"
        onClick={() => navigate("/home")}
      >
        INSTAGRAM
      </h1>

      <div className="flex space-x-4 text-gray-700">
        <Heart
          size={24}
          className="cursor-pointer"
          onClick={() => navigate("/notifications")}
        />
        <MessageCircle
          size={24}
          className="cursor-pointer"
          onClick={() => navigate("/messages")}
        />
      </div>
    </div>
  );
}

export default MobileTopBar;

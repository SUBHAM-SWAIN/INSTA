import {
  Home,
  Search,
  Clapperboard,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
} from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import UserContext from "../context/UserContext";
import CreatePost from "./CreatePost";

function Leftsidebar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);

  const defaultProfile =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Sync show/hide of mobile bottom bar globally
  useEffect(() => {
    window.setBottomBarVisible = setShowBottomBar;
    return () => delete window.setBottomBarVisible;
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  const sidebarItems = [
    { name: "Home", icon: <Home size={24} />, path: "/home" },
    { name: "Search", icon: <Search size={24} />, path: "/explore" },
    { name: "Reels", icon: <Clapperboard size={24} /> }, // no path!
    { name: "Messages", icon: <MessageCircle size={24} />, path: "/messages" },
    { name: "Notifications", icon: <Heart size={24} />, path: "/notifications" },
    { name: "Create", icon: <PlusSquare size={24} /> },
    {
      name: "Profile",
      icon: (
        <img
          src={
            user?.profilePicture?.trim()
              ? user.profilePicture
              : defaultProfile
          }
          alt="Profile"
          className="w-7 h-7 rounded-full object-cover border border-gray-300"
        />
      ),
      path: "/profile",
    },
  ];

  const bottomBarItems = sidebarItems.filter(
    (item) => item.name !== "Messages" && item.name !== "Notifications"
  );

  const handleSidebarClick = (item) => {
    if (item.name === "Create") {
      setShowCreatePost(true);
    } else if (item.name === "Reels") {
      if (typeof window.setReelsInFeed === "function") {
        window.setReelsInFeed(true);
      }
      if (typeof window.setBottomBarVisible === "function") {
        window.setBottomBarVisible(false); // hide bottom bar
      }
      navigate("/home");
    } else if (item.name === "Home") {
      if (typeof window.setReelsInFeed === "function") {
        window.setReelsInFeed(false);
      }
      if (typeof window.setBottomBarVisible === "function") {
        window.setBottomBarVisible(true); // show bottom bar
      }
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-screen 
        w-56 lg:w-64 xl:w-72 
        bg-white border-r border-gray-200 
        flex-col justify-between p-4 z-10"
        style={{ boxShadow: "inset 0 0 10px rgba(0,0,0,0.08)" }}
      >
        <div>
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-pink-600 font-sans cursor-pointer select-none"
              onClick={() => {
                if (typeof window.setReelsInFeed === "function") {
                  window.setReelsInFeed(false);
                }
                if (typeof window.setBottomBarVisible === "function") {
                  window.setBottomBarVisible(true);
                }
                navigate("/home");
              }}
            >
              INSTAGRAM
            </h1>
          </div>

          <nav className="flex flex-col space-y-4">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSidebarClick(item)}
                className="flex items-center space-x-3 text-gray-800 text-sm font-medium cursor-pointer px-3 py-2 rounded transition hover:bg-gray-100"
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </nav>
        </div>

        <div
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-800 text-sm font-medium cursor-pointer px-3 py-2 rounded transition hover:bg-gray-100"
        >
          <LogOut size={24} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Mobile Bottom Navbar (conditionally shown) */}
      {showBottomBar && (
        <nav
          className="fixed bottom-0 left-0 right-0 
          bg-white border-t border-gray-300 
          flex justify-around items-center p-2 
          z-[9999] md:hidden"
        >
          {bottomBarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSidebarClick(item)}
              className="text-gray-700 cursor-pointer"
            >
              {item.icon}
            </div>
          ))}
        </nav>
      )}
    </>
  );
}

export default Leftsidebar;

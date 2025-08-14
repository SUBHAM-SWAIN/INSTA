import React, { useState, useEffect } from "react";
import Feed from "./Feed";
import Reels from "./Reels";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import Leftsidebar from "./Leftsidebar";
import MobileTopBar from "./MobileTopBar";

function Home() {
  const [showReels, setShowReels] = useState(false);

  // Allow Leftsidebar to control Reels visibility
  useEffect(() => {
    window.setReelsInFeed = setShowReels;
    return () => delete window.setReelsInFeed;
  }, []);

  return (
    <div className="flex flex-col bg-white text-black h-screen overflow-hidden">
      {/* ✅ Only show top bar when not showing reels */}
      {!showReels && <MobileTopBar />}

      <div className={`flex flex-1 ${!showReels ? "mt-14" : "mt-0"} md:mt-0 relative overflow-hidden`}>
        {/* Left Sidebar */}
        <div className="hidden md:block fixed top-0 left-0 h-screen w-56 lg:w-64 xl:w-72 z-10 bg-white border-r border-gray-200">
          <Leftsidebar />
        </div>

        {/* Main Area */}
        <main
          className="
            flex-1 relative z-20
            overflow-y-auto scrollbar-hide
            border-x border-gray-200
            px-2 md:px-4
            ml-0 md:ml-56 lg:ml-64 xl:ml-72
            lg:mr-72 xl:mr-80
            2xl:max-w-2xl
          "
        >
          {showReels ? <Reels /> : <Feed />}
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block fixed top-0 right-0 z-10 h-screen w-72 xl:w-80 border-l border-gray-200 bg-white">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
}

export default Home;

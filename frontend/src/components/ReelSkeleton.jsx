import React from "react";

const ReelSkeleton = () => {
  return (
    <div className="h-screen w-full snap-start relative flex justify-center items-center bg-white">
      <div className="w-full h-full max-w-[500px] animate-pulse relative">
        <div className="absolute inset-0 bg-gray-200" style={{ aspectRatio: "9/16" }}></div>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="h-4 bg-gray-400 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="absolute right-4 bottom-24 flex flex-col gap-4 items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full" />
          <div className="w-6 h-6 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ReelSkeleton;

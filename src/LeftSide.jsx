import React from "react";

const LeftSide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-12">
      {/* Main Title */}
      <div className="text-center">
        <h1 className="text-6xl font-bold font-['DM Sans'] mb-2 text-white">
          aaryan joharapurkar
        </h1>
        <h2 className="text-3xl font-bold font-['DM Sans'] text-white mb-2">
          developer/consultant
        </h2>
      </div>

      {/* Subtitle */}
      <p className="text-xl font-['DM Sans'] mt-2 text-center text-white mb-6">
        software engineering with ivey aeo @uwestern
      </p>

      {/* Buttons */}
      <div className="mt-4 flex space-x-4">
        <button className="bg-[#1c255b] px-6 py-2 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          Work
        </button>
        <button className="bg-[#1c255b] px-6 py-2 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          Projects
        </button>
        <button className="bg-[#1c255b] px-6 py-2 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          About
        </button>
      </div>
    </div>
  );
};

export default LeftSide;
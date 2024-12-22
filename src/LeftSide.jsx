import React from "react";

const LeftSide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-8">
      {/* Main Title */}
      <div className="text-center">
        <h1 className="text-6xl font-bold font-['DM Sans'] mb-4 text-white">
          aaryan joharapurkar
        </h1>
        <h2 className="text-3xl font-bold font-['DM Sans'] text-white">
          developer/consultant
        </h2>
      </div>

      {/* Subtitle */}
      <p className="text-xl font-['DM Sans'] mt-4 text-center text-white">
        software engineering with ivey aeo @uwestern
      </p>

      {/* Buttons */}
      <div className="mt-8 flex space-x-6">
        <button className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          work
        </button>
        <button className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          project
        </button>
        <button className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d]">
          about
        </button>
      </div>
    </div>
  );
};

export default LeftSide;
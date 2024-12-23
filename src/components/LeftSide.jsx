import React from "react";

const LeftSide = ({ setCurrentSection, scrollToSection }) => {
  const handleHomeClick = () => {
    setCurrentSection("home");
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAboutClick = () => {
    setCurrentSection("about");
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto lg:h-screen px-8 text-center bg-black sticky top-0">
      <h1 className="text-5xl font-bold text-white">aaryan joharapurkar</h1>
      <h2 className="text-2xl font-semibold text-white mt-4">
        software engineer/consultant
      </h2>
      <p className="text-lg text-white mt-6">
        software engineering with ivey aeo @uwestern
      </p>
      <div className="mt-8 flex space-x-4">
        {/* Responsive Buttons */}
        <button
          onClick={handleHomeClick}
          className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d] focus:outline-none md:px-6 md:py-2 md:text-base"
        >
          Home
        </button>
        <button
          onClick={handleAboutClick} // Scroll to About Section
          className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d] focus:outline-none md:px-6 md:py-2 md:text-base"
        >
          About
        </button>
        <button
          onClick={() => scrollToSection("work")}
          className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d] focus:outline-none md:px-6 md:py-2 md:text-base"
        >
          Work
        </button>
        <button
          onClick={() => scrollToSection("projects")}
          className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d] focus:outline-none md:px-6 md:py-2 md:text-base"
        >
          Projects
        </button>
      </div>

      {/* Additional Text Section */}
      <div className="mt-8">
        {/* Currently Working As */}
        <div>
          <h2 className="text-lg font-semibold text-gray-400">
            currently working as
          </h2>
          <p className="text-md text-white mt-1">
            vp of dev/ops @ western developers society <br />
            consultant analyst @ivey fintech
          </p>
        </div>

        {/* Coding Late Nights On */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-400">
            coding late nights on
          </h2>
          <p className="text-md text-white mt-1">
            an algorithmic trading application
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;

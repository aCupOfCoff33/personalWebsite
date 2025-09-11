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
        software engineering & ivey hba
      </p>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleHomeClick}
          className="bg-[#1c255b] px-8 py-3 rounded-xl text-lg font-bold text-white hover:bg-[#2b347d] focus:outline-none md:px-6 md:py-2 md:text-base"
        >
          Home
        </button>
        <button
          onClick={handleAboutClick}
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

      <div className="mt-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-400">
            currently incoming at
          </h2>
          <p className="text-md text-white mt-1">
            data analytics and strategy @ american global
          </p>
        </div>
        <div>
          <h2 className="mt-6 text-lg font-semibold text-gray-400">
            currently working as
          </h2>
          <p className="text-md text-white mt-1">
            vp of dev/ops @ western developers society <br />
            consultant analyst @ivey fintech
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-400">
            coding late nights on
          </h2>
          <p className="text-md text-white mt-1">
            an algorithmic trading application
          </p>

          {/* Social Media Links */}
          <div className="mt-4 flex space-x-4 justify-center pt-2">
            <a
              href="https://github.com/aCupOfCoff33"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <svg
                className="h-8 w-8 text-slate-500 transition-colors duration-300 group-hover:text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/aaryanj/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <svg
                className="h-8 w-8 text-slate-500 transition-colors duration-300 group-hover:text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/aaryanj05/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <svg
                className="h-8 w-8 text-slate-500 transition-colors duration-300 group-hover:text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://x.com/AaryanJ05"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <svg
                className="h-8 w-8 text-slate-500 transition-colors duration-300 group-hover:text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;

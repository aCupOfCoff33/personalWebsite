import React from "react";
import LeftSide from "./LeftSide";
import AboutMe from "./AboutMe";
import SelectedWorks from "./SelectedWorks";
import SelectedProjects from "./SelectedProjects";

function App() {
  return (
    <div className="relative h-screen w-screen bg-black text-white">
      {/* Fixed Left Section */}
      <div className="fixed top-0 left-0 w-1/2 h-full flex items-center justify-end px-8 z-10 pointer-events-none">
        <LeftSide />
      </div>

      {/* Scrollable Right Section */}
      <div className="absolute top-0 left-0 w-full h-full overflow-y-auto pl-[50%] pr-8">
        <div className="py-8">
          {/* About Me Section */}
          <div className="min-h-screen flex items-center justify-center">
            <AboutMe />
          </div>

          {/* Selected Work Experiences Section */}
          <div className="py-8">
            <SelectedWorks />
          </div>

          {/* Selected Projects Section */}
          <div className="py-8">
            <SelectedProjects />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
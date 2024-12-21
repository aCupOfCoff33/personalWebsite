import React from "react";
import LeftSide from "./LeftSide";
import AboutMe from "./AboutMe";
import SelectedWorks from "./SelectedWorks";
import SelectedProjects from "./SelectedProjects";

function App() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Fixed Left Section */}
      <div className="w-1/2 h-screen fixed flex items-center justify-end px-8">
        <LeftSide />
      </div>

      {/* Scrollable Right Section */}
      <div className="w-1/2 ml-auto h-screen overflow-y-auto">
        {/* About Me Section */}
        <div className="h-screen flex items-center justify-center px-8">
          <AboutMe />
        </div>

        {/* Selected Work Experiences Section */}
        <div className="px-8 py-8">
          <SelectedWorks />
        </div>

        {/* Selected Projects Section */}
        <div className="px-8 py-8">
          <SelectedProjects />
        </div>
      </div>
    </div>
  );
}

export default App;
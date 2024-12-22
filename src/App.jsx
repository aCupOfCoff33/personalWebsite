import React from "react";
import LeftSide from "./LeftSide";
import AboutMe from "./AboutMe";
import SelectedWorks from "./SelectedWorks";
import SelectedProjects from "./SelectedProjects";
import { Background } from "./Background";
import Footer from "./Footer";

const App = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Background />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow z-10">
        {/* Fixed Left Section */}
        <div
          className="w-2/5 h-full fixed top-0 left-0 z-10 overflow-hidden"
          onWheel={(e) => {
            const scrollable = document.querySelector("#scrollable-right");
            if (scrollable) {
              scrollable.scrollBy(0, e.deltaY);
            }
          }}
        >
          <LeftSide />
        </div>

        {/* Scrollable Right Section */}
        <div
          id="scrollable-right"
          className="w-3/5 ml-[40%] h-full overflow-y-auto pr-8"
        >
          <div className="py-8 space-y-12">
            <div className="min-h-screen flex items-center justify-center">
              <AboutMe />
            </div>
            <div>
              <SelectedWorks />
            </div>
            <div>
              <SelectedProjects />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
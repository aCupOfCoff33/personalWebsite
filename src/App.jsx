import React, { useRef, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LeftSide from "./components/LeftSide";
import AboutMe from "./components/AboutMe";
import SelectedWorks from "./components/SelectedWorks";
import SelectedProjects from "./components/SelectedProjects";
import NewAboutPage from "./components/NewAboutPage";
import { Background } from "./components/Background";
import Footer from "./components/Footer";
import "./App.css"; 

const App = () => {
  const rightSideRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");

  useEffect(() => {
    const leftSide = document.getElementById("left-side");
    const rightSide = rightSideRef.current;

    const handleWheel = (e) => {
      if (rightSide && e.deltaY) {
        rightSide.scrollTop += e.deltaY;
      }
    };

    if (leftSide) {
      leftSide.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (leftSide) {
        leftSide.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const scrollToTop = () => {
    setCurrentSection("home");
    if (rightSideRef.current) {
      rightSideRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (id) => {
    if (id === "top") {
      scrollToTop();
    } else {
      setCurrentSection("home");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Background />
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-20">
        <button
          className="text-white p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-1 bg-white mb-1"></div>
          <div className="w-6 h-1 bg-white mb-1"></div>
          <div className="w-6 h-1 bg-white"></div>
        </button>
        {isMenuOpen && (
          <div className="absolute top-12 right-0 bg-black border border-gray-700 rounded-lg shadow-md p-4">
            <ul className="space-y-4">
              {/* Home */}
              <li>
                <button
                  onClick={() => {
                    scrollToTop();
                    setIsMenuOpen(false); // Close menu
                  }}
                  className="text-white hover:underline"
                >
                  Home
                </button>
              </li>
              {/* About */}
              <li>
                <button
                  onClick={() => {
                    setCurrentSection("about");
                    setIsMenuOpen(false); // Close menu
                  }}
                  className="text-white hover:underline"
                >
                  About
                </button>
              </li>
              {/* Work */}
              <li>
                <button
                  onClick={() => {
                    scrollToSection("work");
                    setIsMenuOpen(false); // Close menu
                  }}
                  className="text-white hover:underline"
                >
                  Work
                </button>
              </li>
              {/* Projects */}
              <li>
                <button
                  onClick={() => {
                    scrollToSection("projects");
                    setIsMenuOpen(false); // Close menu
                  }}
                  className="text-white hover:underline"
                >
                  Projects
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Main Layout */}
      <div className="lg:grid lg:grid-cols-5 h-full relative z-10">
        {/* Left Sidebar */}
        <div
          id="left-side"
          className="hidden lg:block lg:col-span-2 sticky top-0 h-screen bg-black"
        >
          <LeftSide
            setCurrentSection={setCurrentSection}
            scrollToSection={scrollToSection}
          />
        </div>

        {/* Smooth Transition Container */}
        <div className="lg:col-span-3 overflow-hidden">
          <TransitionGroup>
            {currentSection === "home" ? (
              <CSSTransition key="home" timeout={500} classNames="fade">
                <div
                  ref={rightSideRef}
                  id="main-content" // Added ID
                  className="overflow-y-auto px-6 sm:px-8 relative h-full"
                >
                  {/* Mobile Layout */}
                  <div className="block lg:hidden space-y-8 px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
                    <h1 className="text-4xl font-bold">aaryan joharapurkar</h1>
                    <p className="text-xl">software engineer/consultant</p>

                    {/* Current Job */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-400">
                        currently working as
                      </h2>
                      <p className="text-md">
                        vp of dev/ops @ western developers society <br />
                        consultant analyst @ivey fintech
                      </p>
                    </div>

                    {/* Top Project */}
                    <div className="mt-6 mb-6 sm:mb-12">
                      <h2 className="text-lg font-semibold text-gray-400">
                        coding late nights on
                      </h2>
                      <p className="text-md">
                        an algorithmic trading application
                      </p>
                    </div>
                  </div>

                  {/* Adjust spacing below */}
                  <div className="space-y-6 sm:space-y-8 lg:mt-0 lg:pt-0">
                    <section
                      id="about"
                      className="flex items-center lg:h-screen lg:justify-center sm:pt-16"
                    >
                      <AboutMe />
                    </section>

                    <section id="work" className="py-12 lg:py-16">
                      <SelectedWorks />
                    </section>

                    <section id="projects" className="py-12">
                      <SelectedProjects />
                    </section>
                  </div>
                  <Footer />
                </div>
              </CSSTransition>
            ) : (
              <CSSTransition key="about" timeout={500} classNames="fade">
                <div className="flex items-center justify-center px-6 sm:px-8">
                  <NewAboutPage scrollToSection={scrollToSection} />
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
};

export default App;

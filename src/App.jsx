import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import HeroBackground from "./components/common/HeroBackground";
import { NotesProvider } from "./components/notes/NotesContext";
import BearProvider from "./components/common/BearContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Optimized for performance by lazy-loading route components
// This reduces initial bundle size without changing functionality
const Home = lazy(() => import("./features/home/components/Home"));
const AboutMe = lazy(() => import("./features/about/components/AboutMe"));
const Projects = lazy(() => import("./features/projects/components/Projects"));
const NotePage = lazy(() => import("./components/notes/NotePage"));
const Resume = lazy(() => import("./features/resume/components/Resume"));

function App() {
  return (
    <ErrorBoundary>
      <BearProvider>
        <NotesProvider>
        {/* Skip Navigation Link for Accessibility */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        
        <div className="flex flex-col md:flex-row h-screen w-full bg-[#0C100D] overflow-hidden">
          <NavBar />

          {/* Layout: Main content window wrapper - SCROLLABLE */}
          <div className="flex-1 h-full p-2 md:p-3 overflow-y-auto overflow-x-hidden relative scrollbar-gutter-stable">
             <main id="main-content" tabIndex="-1" className="relative min-h-full w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col isolate">
                {/* Global background - Sticky inside the scrolling container */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="sticky top-0 h-screen w-full">
                        <HeroBackground />
                    </div>
                </div>
                
                <div className="flex-1 relative z-0">
                  {/* ---- ROUTE OUTLET ---- */}
                  <Suspense fallback={null}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/about" element={<AboutMe />} />
                      <Route path="/resume" element={<Resume />} />
                      {/* Notes feature: only detail route is exposed */}
                      <Route path="/notes/:slug" element={<NotePage />} />
                    </Routes>
                  </Suspense>

                  {/* Footer lives outside Routes so it shows on every page */}
                  <footer className="relative bg-black/50 backdrop-blur-sm text-center py-10 text-gray-500 z-10">
                    © 2025 Aaryan Joharapurkar. Designed from the depths of my cave.
                  </footer>
                </div>
             </main>
          </div>
        </div>
        </NotesProvider>
      </BearProvider>
    </ErrorBoundary>
  );
}

export default App;

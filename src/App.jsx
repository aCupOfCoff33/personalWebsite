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
        
        {/* Global background - prevents remounting between pages */}
        <HeroBackground />
        <NavBar />

        {/* Layout: leave space for the left sidebar on desktop and top bar on mobile */}
        <main id="main-content" tabIndex="-1" className="relative md:ml-60 pt-12 md:pt-0">
          {/* ---- ROUTE OUTLET ---- */}
          {/* Optimized: wrap routes in Suspense for code-split chunks; fallback null to avoid UI change */}
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
          <footer className="relative bg-black text-center py-10 text-gray-500 z-10">
            © 2025 Aaryan Joharapurkar. Designed from the depths of my cave.
          </footer>
        </main>
        </NotesProvider>
      </BearProvider>
    </ErrorBoundary>
  );
}

export default App;

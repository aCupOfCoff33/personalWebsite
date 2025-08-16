import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import HeroBackground from "./components/HeroBackground";
import { NotesProvider } from "./components/notes/NotesContext";
import BearProvider from "./components/BearContext";

// Optimized for performance by lazy-loading route components
// This reduces initial bundle size without changing functionality
const Home = lazy(() => import("./components/Home"));
const AboutMe = lazy(() => import("./components/AboutMe"));
const Projects = lazy(() => import("./components/Projects"));
const NotePage = lazy(() => import("./components/notes/NotePage"));

function App() {
  return (
    <BearProvider>
      <NotesProvider>
      {/* Global background - prevents remounting between pages */}
      <HeroBackground />
      <NavBar />

      {/* Layout: leave space for the left sidebar on desktop and top bar on mobile */}
      <main className="relative md:ml-60 pt-12 md:pt-0">
        {/* ---- ROUTE OUTLET ---- */}
        {/* Optimized: wrap routes in Suspense for code-split chunks; fallback null to avoid UI change */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<AboutMe />} />
            {/* Notes feature: only detail route is exposed */}
            <Route path="/notes/:slug" element={<NotePage />} />
          </Routes>
        </Suspense>

        {/* Footer lives outside Routes so it shows on every page */}
        <footer className="relative bg-black text-center py-10 text-gray-500 z-10">
          Your Footer Content Here
        </footer>
      </main>
    </NotesProvider>
    </BearProvider>
  );
}

export default App;

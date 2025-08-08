import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import HeroBackground from "./components/HeroBackground";
import Home from "./components/Home";
import AboutMe from "./components/AboutMe";
import Work from "./components/Work";
import Projects from "./components/Projects";

function App() {
  return (
    <>
      {/* Global background - prevents remounting between pages */}
      <HeroBackground />
      <NavBar />

      {/* Layout: leave space for the left sidebar on desktop and top bar on mobile */}
      <main className="relative md:ml-60 pt-16 md:pt-0">
        {/* ---- ROUTE OUTLET ---- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>

        {/* Footer lives outside Routes so it shows on every page */}
        <footer className="relative bg-black text-center py-10 text-gray-500 z-10">
          Your Footer Content Here
        </footer>
      </main>
    </>
  );
}

export default App;

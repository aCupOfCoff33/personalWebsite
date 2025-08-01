import { Link } from "react-router-dom";
import BearIconSVG from "./BearIcon";

const links = [
  { to: "/work",    label: "work" },
  { to: "/projects", label: "projects" },
  { to: "/about",    label: "about" },
];

import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 overflow-hidden font-dmsans text-white">
      {/* Performance-optimized blur alternative using pseudo-element */}
      <div className="absolute inset-0 bg-navbar-bg/70" />
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(235, 235, 235, 0.08)',
          filter: 'blur(12px)',
          zIndex: -1,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-b from-navbar-bg/70 to-transparent" />

      <div className="relative container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          <Link to="/" className="text-4xl font-bold lg:text-5xl">
            aaryan
          </Link>
          <BearIconSVG className="ml-3 h-24 w-24" />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-3 md:space-x-4">
          {links.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className="rounded-xl bg-brand-blue px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-brand-blue-hover md:px-6 md:text-base"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center md:hidden">
          <button
            className="absolute top-6 right-6 p-2 text-white"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
          <div className="flex flex-col gap-8 mt-12">
            {links.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="text-3xl font-bold uppercase tracking-wider text-white px-8 py-4 rounded-xl bg-brand-blue shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

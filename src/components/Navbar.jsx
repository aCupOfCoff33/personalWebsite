// src/components/Navbar.jsx
import React from 'react';
// Import the NEW SVG component
import BearIconSVG from './BearIcon'; // <-- Make sure filename matches

const Navbar = () => {
  const navLinks = [
    { href: '#work', label: 'work' },
    { href: '#projects', label: 'projects' },
    { href: '#about', label: 'about' },
  ];

  return (
    <nav className="bg-navbar-bg py-3 font-dmsans text-white">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <a href="/" className="text-4xl font-bold lg:text-5xl">
            aaryan
          </a>
          {/* Use the new SVG component */}
          {/* Apply Tailwind size and margin classes HERE */}
          <BearIconSVG className="ml-3 h-24 w-24" /> {/* Adjust size (h-16 w-16 = 64px) as needed */}
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-xl bg-brand-blue px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 ease-in-out hover:bg-brand-blue-hover md:px-6 md:text-base"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
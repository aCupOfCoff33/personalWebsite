import React, { useState } from "react";
import { Link } from "react-router-dom";
import BearIconSVG from "./BearIcon";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = React.useRef(0);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const startPoint = window.innerHeight * 0.7;
          const endPoint = window.innerHeight * 1.2;
          const currentScroll = scrollRef.current;
          let progress = 0;
          if (currentScroll > startPoint) {
            progress = Math.min((currentScroll - startPoint) / (endPoint - startPoint), 1);
          }
          // Only update state if progress changes enough to affect UI
          if (Math.abs(progress - scrollProgress) > 0.01) {
            setScrollProgress(progress);
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollProgress]);

  // Interpolate values based on scroll progress
  const interpolateValue = (start, end, progress) => start + (end - start) * progress;
  
  // Calculate dynamic styles with proper easing
  const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress); // Smooth easing
  
  // Use state for viewport width to trigger re-render on resize
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Responsive container styles with animation for mobile
  const isMobile = viewportWidth < 768;
  let containerStyle, leftStyle, rightStyle;
  if (isMobile) {
    // Animate from original to final mobile layout on scroll
    // Original: maxWidth 100%, padding 24px, bg transparent, no blur
    // Final: maxWidth 80.25%, padding 32.78px, bg rgba(15,16,16,1), blur 10.97px
    containerStyle = {
      maxWidth: `${interpolateValue(100, 80.25, easedProgress)}%`,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: `${interpolateValue(24, 32.78, easedProgress)}px`,
      paddingRight: `${interpolateValue(24, 32.78, easedProgress)}px`,
      backgroundColor: `rgba(15, 16, 16, ${interpolateValue(0, 1, easedProgress)})`,
      backdropFilter: `blur(${interpolateValue(0, 10.97, easedProgress)}px)`,
      borderRadius: '20px',
      boxShadow: 'none',
    };
    leftStyle = { transform: `translateX(${interpolateValue(0, 21.23, easedProgress)}px)`, transition: 'none' };
    rightStyle = { transform: `translateX(${interpolateValue(0, -21.23, easedProgress)}px)`, transition: 'none' };
  } else {
    containerStyle = {
      maxWidth: `${interpolateValue(100, 64, easedProgress)}%`,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: `${interpolateValue(20, 40, easedProgress)}px`,
      paddingRight: `${interpolateValue(20, 40, easedProgress)}px`,
      backgroundColor: scrollProgress > 0 ? `rgba(15, 16, 16, ${interpolateValue(0, 1, easedProgress)})` : 'transparent',
      backdropFilter: scrollProgress > 0 ? `blur(${interpolateValue(0, 20, easedProgress)}px)` : 'none',
      borderRadius: '20px',
      boxShadow: 'none',
    };
    const finalContainerWidth = viewportWidth * 0.64; // 64% of viewport
    const travelDistance = (viewportWidth - finalContainerWidth) / 4; // Quarter of the difference
    leftStyle = { transform: `translateX(${interpolateValue(0, travelDistance, easedProgress)}px)`, transition: 'none' };
    rightStyle = { transform: `translateX(${interpolateValue(0, -travelDistance, easedProgress)}px)`, transition: 'none' };
  }

  return (
    <nav className="w-full mt-6 flex items-center justify-between py-3 rounded-2xl sticky top-4 z-50" style={containerStyle}>
      {/* Left: Name and Bear Icon */}
      <div className="flex items-center" style={leftStyle}>
        <span className="font-bold text-2xl text-white select-none mr-6">
          aaryan
        </span>
        <BearIconSVG className="h-20 w-20" />
      </div>
      {/* Right: Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-8" style={rightStyle}>
        <Link to="/work" className="text-white font-medium hover:text-blue-400 transition">Work</Link>
        <Link to="/stories" className="text-white font-medium hover:text-blue-400 transition">Stories</Link>
        <Link to="/about" className="text-white font-medium hover:text-blue-400 transition">About</Link>
      </div>
      {/* Hamburger (Mobile) - always visible on mobile */}
      <div className="flex md:hidden items-center">
        <button
          className="flex items-center justify-center rounded-full p-3 bg-neutral-900/60 text-white hover:bg-neutral-800 transition focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Mobile Menu - full width on mobile */}
      {menuOpen && (
        <div className="fixed inset-0 bg-neutral-900/95 rounded-none border-none flex flex-col items-center justify-center p-8 z-[100] md:hidden">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>
          <Link to="/work" className="text-white font-bold text-2xl mb-6 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Work</Link>
          <Link to="/stories" className="text-white font-bold text-2xl mb-6 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Stories</Link>
          <Link to="/about" className="text-white font-bold text-2xl hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

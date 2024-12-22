"use client";

import React from "react";
import { motion } from "framer-motion";

export const Background = () => {
  // Further reduced number of paths for minimal clutter
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
    "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
    "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
    "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
    "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
  ];

  // Generate a single shooting star with controlled frequency
  const generateShootingStars = () => {
    const star = {
      id: 1,
      top: Math.random() * 60 + 20, // Random vertical position (20% to 80%)
      delay: Math.random() * 3, // Initial delay between 0 to 3 seconds
    };

    return (
      <motion.div
        key={star.id}
        initial={{
          opacity: 0,
          x: "100vw",
          y: `${star.top}vh`,
        }}
        animate={{
          opacity: 1,
          x: "-20vw",
          y: `${star.top + Math.random() * 2}vh`, // Minimal vertical movement
        }}
        transition={{
          duration: 1, // Duration of the shooting star animation
          delay: star.delay, // Initial delay
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.5, // Delay between repeats (2.5 seconds)
        }}
        className="absolute w-[1px] h-8 bg-gradient-to-r from-purple-300 via-blue-300 to-transparent"
      />
    );
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Beams */}
      <div className="absolute h-full w-full inset-0">
        <svg
          className="z-0 h-full w-full pointer-events-none absolute"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {paths.map((path, index) => (
            <motion.path
              key={`path-${index}`}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.3" // Slightly reduced opacity
              strokeWidth="0.4" // Thinner strokes
            />
          ))}
          <defs>
            {paths.map((path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: [`0%`, `${93 + Math.random() * 5}%`], // Slightly less variation
                }}
                transition={{
                  duration: Math.random() * 8 + 8, // Shorter duration
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              >
                <stop stopColor="#18CCFC" stopOpacity="0"></stop>
                <stop stopColor="#18CCFC" />
                <stop offset="30%" stopColor="#6344F5" /> {/* Adjusted offset */}
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0"></stop>
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>

      {/* Shooting Star */}
      {generateShootingStars()}
    </div>
  );
};
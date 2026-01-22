import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-4 sm:px-12 w-full relative z-10">
      <div className="flex gap-4 flex-wrap justify-center sm:justify-end text-sm sm:text-base">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://twitter.com/aaryanj05"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          X (Twitter)
        </a>
      </div>
    </footer>
  );
};

export default Footer;
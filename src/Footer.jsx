import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-12 flex justify-between items-center w-full z-20">
      {/* Left Section */}
      <div className="text-base">
        <p>a product by aaryan joharapurkar</p>
        <p>built by @aaryan</p>
      </div>

      {/* Right Section */}
      <div className="flex space-x-8 text-base">
        <a href="#" className="hover:underline">
          Instagram
        </a>
        <a href="#" className="hover:underline">
          LinkedIn
        </a>
        <a href="#" className="hover:underline">
          GitHub
        </a>
        <a href="#" className="hover:underline">
          X (Twitter)
        </a>
      </div>
    </footer>
  );
};

export default Footer;
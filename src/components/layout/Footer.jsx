import React from "react";

const Footer = () => {
  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/aaryanj05/",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aaryanj/",
    },
    {
      label: "GitHub",
      href: "https://github.com/aCupOfCoff33",
    },
    {
      label: "X (Twitter)",
      href: "https://twitter.com/aaryanj05",
    },
  ];

  return (
    <footer className="bg-transparent text-white py-6 px-4 sm:px-12 w-full relative z-10">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start sm:justify-between">
        {/* Left side text */}
        <div className="text-center sm:text-left text-sm sm:text-base text-gray-400">
          <p>Designed + Coded by Aaryan Joharapurkar</p>
          <p>Designed from the depths of my cave.</p>
        </div>

        {/* Right side social links */}
        <div className="flex gap-4 flex-wrap justify-center sm:justify-end text-sm sm:text-base">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";

const Footer = () => {
  const socialLinks = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aaryanj/",
    },
    {
      label: "GitHub",
      href: "https://github.com/aaryanj05",
    },
    {
      label: "X (Twitter)",
      href: "https://twitter.com/aaryanj05",
    },
  ];

  return (
    <footer className="bg-transparent text-gray-400 py-6 px-4 sm:px-12 w-full relative z-10 font-adamant">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start sm:justify-between">
        {/* Left side text */}
        <div className="text-center sm:text-left text-sm sm:text-base">
          <p>Designed & Coded From the Depths of My Cave 🐻</p>
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

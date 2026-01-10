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
    </footer>
  );
};

export default Footer;

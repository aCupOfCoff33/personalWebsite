import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
// Alias to capitalized variable so linters recognize JSX usage
const M = motion;

function TOCItem({ id, text, level, onClick }) {
  return (
    <div className="w-full py-2.5 px-1 relative">
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          if (onClick) onClick(id);
        }}
        className="inline-flex items-center focus:outline-none group"
        aria-label={`Jump to ${text}`}
      >
        <span
          className={[
            "font-adamant transition-colors text-xs",
            level > 1
              ? "text-white/50 group-hover:text-white"
              : "text-white/50 group-hover:text-white",
          ].join(" ")}
        >
          {text}
        </span>
      </a>
      {/* Border on the bottom of each item - starts at left-1 to align with text */}
      <div className="absolute left-1 right-0 bottom-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

TOCItem.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  level: PropTypes.number,
  onClick: PropTypes.func,
};

const TOC = React.memo(function TOC({ items, className = "", visible = true }) {
  if (!items?.length) return null;
  return (
    <M.nav
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      aria-label="Table of contents"
      aria-hidden={!visible}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className={`hidden lg:block sticky top-28 max-h-[70vh] overflow-auto rounded-xl bg-[#0C100D]/70 backdrop-blur ${className}`}
    >
      <div className="flex flex-col relative">
        {/* Top border - starts at left-1 to align with "IN THIS STORY" text */}
        <div className="absolute left-1 right-0 top-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
        {items.map((item) => (
          <TOCItem key={item.id} {...item} />
        ))}
      </div>
    </M.nav>
  );
});

TOC.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      level: PropTypes.number,
    }),
  ),
  className: PropTypes.string,
  visible: PropTypes.bool,
};

export default TOC;

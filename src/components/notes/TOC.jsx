import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function TOCItem({ id, text, level, onClick }) {
  return (
    <li className="my-1">
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (onClick) onClick(id);
        }}
        className={[
          'block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded transition-colors',
          level > 1
            ? 'pl-3 text-sm text-neutral-300 hover:text-white'
            : 'pl-0 font-adamant italic text-base text-white',
        ].join(' ')}
        aria-label={`Jump to ${text}`}
      >
        {text}
      </a>
    </li>
  );
}

TOCItem.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  level: PropTypes.number,
  onClick: PropTypes.func,
};

const TOC = React.memo(function TOC({ items, className = '', visible = true }) {
  if (!items?.length) return null;
  return (
    <motion.nav
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      aria-label="Table of contents"
      aria-hidden={!visible}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      className={`hidden lg:block sticky top-28 max-h-[70vh] overflow-auto p-4 rounded-xl border border-white/10 bg-[#0C100D]/70 backdrop-blur ${className}`}
    >
      <ul>
        {items.map((item) => (
          <TOCItem key={item.id} {...item} />
        ))}
      </ul>
    </motion.nav>
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



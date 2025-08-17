import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';


function ContentCard({
  title,
  subtitle,
  dates,
  logo,
  gradient = 'from-cyan-400 to-blue-500', // supply just the colour stops or a full bg-*
  href,
  className = '',
}) {
  const gradientClass = gradient && gradient.includes('bg-')
    ? gradient
    : `bg-gradient-to-r ${gradient}`;
  return (
    <div
      className={clsx(
        'group shrink-0 snap-start',
        'relative isolate p-px z-[100]',           // 1-px padding for gradient border and high z-index
        'w-80',                            // Removed invalid md:w-88 (not in default scale)
        'h-[512px]',                       // 8-pt multiple
        'transition-transform duration-300 ease-out hover:scale-[1.02]',
        className,
      )}
    >
      <div
        className="absolute inset-0  bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* card body */}
      {(href ? (
        <a
          href={href}
          className="relative flex h-full w-full flex-col overflow-hidden rounded hover:backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 p-4 space-y-4 transition-colors duration-300 ease-out"
          onClick={() => {
            // allow anchor navigation to router; do not scroll to top of current page
          }}
        >
          {/* hero panel */}
          <div className="relative flex-1 min-h-[288px] rounded-xl overflow-hidden" style={{ willChange: 'transform' }}>
            <div className={clsx('absolute inset-0', gradientClass)} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex items-center gap-4">
            {logo && (
              <img src={logo} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" loading="lazy" decoding="async" />
            )}
            <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
          </div>

          {subtitle && (
            <p className="text-sm font-semibold tracking-wide text-white/90">{subtitle}</p>
          )}

          {dates && <p className="text-xs font-medium text-white/70">{dates}</p>}
        </a>
      ) : (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded p-4 space-y-4">
          {/* hero panel */}
          <div className="relative flex-1 min-h-[288px] rounded-xl overflow-hidden" style={{ willChange: 'transform' }}>
            <div className={clsx('absolute inset-0', gradientClass)} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex items-center gap-4">
            {logo && (
              <img src={logo} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" loading="lazy" decoding="async" />
            )}
            <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
          </div>

          {subtitle && (
            <p className="text-sm font-semibold tracking-wide text-white/90">{subtitle}</p>
          )}

          {dates && <p className="text-xs font-medium text-white/70">{dates}</p>}
        </div>
      ))}
    </div>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentCard);

// PropTypes for clear component contracts and error catching
ContentCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  dates: PropTypes.string,
  logo: PropTypes.string,
  gradient: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';


function ContentCard({
  title,
  subtitle,
  dates,
  logo,
  image,
  gradient = 'from-cyan-400 to-blue-500', // supply just the colour stops or a full bg-*
  href,
  className = '',
}) {
  // Track if the provided image failed to load so we can fall back to the gradient
  const [imageFailed, setImageFailed] = useState(false);
  const gradientClass = gradient && gradient.includes('bg-')
    ? gradient
    : `bg-gradient-to-r ${gradient}`;
  return (
    <div
      className={clsx(
        'group shrink-0 snap-start',
        'relative isolate p-px z-[100]',           // 1-px padding for gradient border and high z-index
        'w-full max-w-[420px] mx-auto',            // fill available width on mobile and center, cap width
        'aspect-[5/8] md:w-80 md:h-[512px] md:aspect-auto', // maintain aspect ratio on mobile, keep desktop sizes on md+
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
          <div className="relative flex-1 h-full rounded-xl overflow-hidden" style={{ willChange: 'transform' }}>
            {/* If an image is provided, render it as the hero background; otherwise fall back to the gradient */}
            {/* Prefer the provided image, but if it fails to load (404 or other), fall back to the gradient */}
            {image && !imageFailed ? (
              <img
                src={image}
                alt={title || ''}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                onLoad={() => setImageFailed(false)}
              />
            ) : (
              <div className={clsx('absolute inset-0', gradientClass)} />
            )}
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
          <div className="relative flex-1 h-full rounded-xl overflow-hidden" style={{ willChange: 'transform' }}>
            {image && !imageFailed ? (
              <img
                src={image}
                alt={title || ''}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                onLoad={() => setImageFailed(false)}
              />
            ) : (
              <div className={clsx('absolute inset-0', gradientClass)} />
            )}
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

// Add optional image prop for hero backgrounds
ContentCard.propTypes.image = PropTypes.string;

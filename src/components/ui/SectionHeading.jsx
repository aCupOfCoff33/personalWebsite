import React from 'react';
import PropTypes from 'prop-types';

/**
 * Unified SectionHeading component
 * Provides consistent styling for section titles and subtitles across the site
 * Uses Adamant font with italic styling to match the hero aesthetic
 */
const SectionHeading = ({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <div className={`mb-12 ${className}`}>
      <h2
        className={`text-4xl font-normal italic text-white font-adamant ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-gray-300 mt-3 text-lg font-adamant ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  subtitleClassName: PropTypes.string,
};

export default SectionHeading;

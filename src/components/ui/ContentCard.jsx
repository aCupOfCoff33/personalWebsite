import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function ContentCard({
  variant = "default",
  title,
  subtitle,
  dates,
  logo,
  image,
  gradient = "from-cyan-400 to-blue-500", // supply just the colour stops or a full bg-*
  href,
  className = "",
}) {
  // Track if the provided image failed to load so we can fall back to the gradient
  const [imageFailed, setImageFailed] = useState(false);
  const gradientClass =
    gradient && gradient.includes("bg-")
      ? gradient
      : `bg-gradient-to-r ${gradient}`;
  if (variant === "inline") {
    const Wrapper = href ? "a" : "div";
    const wrapperProps = href ? { href } : {};
    return (
      <Wrapper
        {...wrapperProps}
        className={clsx(
          "w-full py-5 md:py-6 px-4 sm:px-5 relative inline-flex items-center gap-4 rounded-xl overflow-hidden",
          "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px",
          "after:bg-gradient-to-r after:from-white/10 after:to-transparent",
          "first:before:content-[''] first:before:absolute first:before:left-0 first:before:right-0 first:before:top-0 first:before:h-px",
          "first:before:bg-gradient-to-r first:before:from-white/10 first:before:to-transparent",
          "hover:bg-white/5 transition-colors",
          href
            ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            : "",
          className,
        )}
      >
        {logo && (
          <div className="size-10 sm:size-[42px] p-[5px] rounded-[10px] flex justify-center items-center shadow-[0_1px_8px_rgba(255,255,255,0.08)] bg-gradient-to-br from-white to-white/90 flex-shrink-0">
            <img
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain"
              src={logo}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-[6px]">
          <div className="text-white text-xl md:text-2xl font-normal font-adamant">
            {title}
          </div>
          {subtitle && (
            <div className="text-white/70 md:text-white/75 text-base md:text-lg font-normal font-adamant">
              {subtitle}
            </div>
          )}
        </div>

        {dates && (
          <div
            className="ml-auto text-right text-white/70 md:text-white/80 text-xs sm:text-sm font-normal font-adamant drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {dates}
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <div
      className={clsx(
        "group relative isolate p-px", // 1-px padding for gradient border
        "w-full max-w-[600px] mx-auto", // fill container up to a max width
        "aspect-[16/12]", // match wide project card proportions
        "transition-transform duration-300 ease-out hover:scale-[1.02]",
        className,
      )}
    >
      <div className="absolute inset-0  bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* card body */}
      {href ? (
        <a
          href={href}
          className="relative flex h-full w-full flex-col overflow-hidden rounded hover:backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 p-4 space-y-3 transition-colors duration-300 ease-out"
          onClick={() => {
            // allow anchor navigation to router; do not scroll to top of current page
          }}
        >
          {/* hero panel */}
          <div
            className="relative flex-1 h-full rounded-xl overflow-hidden"
            style={{ willChange: "transform" }}
          >
            {/* If an image is provided, render it as the hero background; otherwise fall back to the gradient */}
            {/* Prefer the provided image, but if it fails to load (404 or other), fall back to the gradient */}
            {image && !imageFailed ? (
              <img
                src={image}
                alt={title || ""}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                onLoad={() => setImageFailed(false)}
              />
            ) : (
              <div className={clsx("absolute inset-0", gradientClass)} />
            )}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex items-center gap-4">
            {logo && (
              <img
                src={logo}
                alt=""
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <h3 className="text-lg font-semibold leading-tight text-white">
              {title}
            </h3>
          </div>

          {subtitle && (
            <p className="text-sm font-semibold tracking-wide text-white/90">
              {subtitle}
            </p>
          )}

          {dates && (
            <p className="text-xs font-medium text-white/70">{dates}</p>
          )}
        </a>
      ) : (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded p-4 space-y-3">
          {/* hero panel */}
          <div
            className="relative flex-1 h-full rounded-xl overflow-hidden"
            style={{ willChange: "transform" }}
          >
            {image && !imageFailed ? (
              <img
                src={image}
                alt={title || ""}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                onLoad={() => setImageFailed(false)}
              />
            ) : (
              <div className={clsx("absolute inset-0", gradientClass)} />
            )}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex items-center gap-4">
            {logo && (
              <img
                src={logo}
                alt=""
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <h3 className="text-lg font-semibold leading-tight text-white">
              {title}
            </h3>
          </div>

          {subtitle && (
            <p className="text-sm font-semibold tracking-wide text-white/90">
              {subtitle}
            </p>
          )}

          {dates && (
            <p className="text-xs font-medium text-white/70">{dates}</p>
          )}
        </div>
      )}
    </div>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentCard);

// PropTypes for clear component contracts and error catching
ContentCard.propTypes = {
  variant: PropTypes.string,
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

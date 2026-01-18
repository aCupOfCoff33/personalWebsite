import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Generate WebP source path from original path
const getWebPPath = (src) => {
  if (!src) return null;
  return src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
};

function ContentCard({
  variant = "default",
  title,
  subtitle,
  description,
  logo,
  image,
  gradient = "from-cyan-400 to-blue-500", // supply just the colour stops or a full bg-*
  href,
  link,
  className = "",
  priority = false, // Add priority prop for above-fold images
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
          "w-full py-4 md:py-5 px-4 sm:px-5 relative inline-flex items-center gap-4 rounded-xl overflow-hidden",
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
          <div className="size-9 sm:size-10 p-[5px] rounded-[10px] flex justify-center items-center shadow-[0_1px_8px_rgba(255,255,255,0.08)] bg-gradient-to-br from-white to-white/90 flex-shrink-0">
            <img
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-contain"
              src={logo}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-[4px]">
          <div className="text-white text-lg md:text-xl font-normal font-adamant leading-tight">
            {title}
          </div>
          {subtitle && (
            <div className="text-white/70 md:text-white/75 text-base md:text-lg font-normal font-adamant leading-tight">
              {subtitle}
            </div>
          )}
        </div>
      </Wrapper>
    );
  }

  // Use link if available, otherwise fall back to href
  const cardLink = link || href;
  const isExternalLink =
    cardLink &&
    (cardLink.startsWith("http://") || cardLink.startsWith("https://"));

  return (
    <div
      className={clsx(
        "group relative isolate p-px", // 1-px padding for gradient border
        "w-full max-w-[600px] mx-auto", // fill container up to a max width
        "transition-transform duration-300 ease-out hover:scale-[1.02]",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* card body */}
      {cardLink ? (
        <a
          href={cardLink}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-xl hover:backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 p-3 md:p-4 space-y-2 md:space-y-3 transition-colors duration-300 ease-out"
          onClick={() => {
            // allow anchor navigation to router; do not scroll to top of current page
          }}
        >
          {/* hero panel */}
          <div
            className="relative flex-shrink-0 w-full aspect-video rounded-xl overflow-hidden"
            style={{ willChange: "transform" }}
          >
            {/* If an image is provided, render it as the hero background; otherwise fall back to the gradient */}
            {/* Prefer the provided image, but if it fails to load (404 or other), fall back to the gradient */}
            {image && !imageFailed ? (
              <picture>
                {getWebPPath(image) && (
                  <source srcSet={getWebPPath(image)} type="image/webp" />
                )}
                <img
                  src={image}
                  alt={title || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={priority ? "eager" : "lazy"}
                  decoding={priority ? "sync" : "async"}
                  fetchPriority={priority ? "high" : "auto"}
                  onError={() => setImageFailed(true)}
                  onLoad={() => setImageFailed(false)}
                />
              </picture>
            ) : (
              <div className={clsx("absolute inset-0", gradientClass)} />
            )}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              {logo && (
                <img
                  src={logo}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3 className="text-lg font-semibold leading-tight text-white">
                {title}
              </h3>
            </div>

            {description && (
              <p className="text-sm text-white/70 line-clamp-2">
                {description}
              </p>
            )}

            {subtitle && (
              <p className="text-sm font-semibold tracking-wide text-white/90">
                {subtitle}
              </p>
            )}
          </div>
        </a>
      ) : (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
          {/* hero panel */}
          <div
            className="relative flex-shrink-0 w-full aspect-video rounded-xl overflow-hidden"
            style={{ willChange: "transform" }}
          >
            {image && !imageFailed ? (
              <picture>
                {getWebPPath(image) && (
                  <source srcSet={getWebPPath(image)} type="image/webp" />
                )}
                <img
                  src={image}
                  alt={title || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={priority ? "eager" : "lazy"}
                  decoding={priority ? "sync" : "async"}
                  fetchPriority={priority ? "high" : "auto"}
                  onError={() => setImageFailed(true)}
                  onLoad={() => setImageFailed(false)}
                />
              </picture>
            ) : (
              <div className={clsx("absolute inset-0", gradientClass)} />
            )}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>

          {/* meta */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              {logo && (
                <img
                  src={logo}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3 className="text-lg font-semibold leading-tight text-white">
                {title}
              </h3>
            </div>

            {description && (
              <p className="text-sm text-white/70 line-clamp-2">
                {description}
              </p>
            )}

            {subtitle && (
              <p className="text-sm font-semibold tracking-wide text-white/90">
                {subtitle}
              </p>
            )}
          </div>
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
  description: PropTypes.string,
  dates: PropTypes.string,
  logo: PropTypes.string,
  image: PropTypes.string,
  gradient: PropTypes.string,
  href: PropTypes.string,
  link: PropTypes.string,
  className: PropTypes.string,
  priority: PropTypes.bool,
};

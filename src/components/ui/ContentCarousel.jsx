import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ContentCard from "./ContentCard";

// View All Projects Button Component - matches navbar card style and small size
function ViewAllButton({
  onClick,
  className = "",
  label = "Venture Deeper Into\nThe Woods",
}) {
  // normalize either literal '/n' in label to real newline
  const normalized = String(label)
    .replace(/\/n/g, "\n")
    .replace(/\/\\n/g, "\n");
  const normalized2 = normalized.replace(/\/\/?n/g, "\n");
  const lines = normalized2.split("\n");

  return (
    <div className="snap-start shrink-0 w-44 flex items-center justify-center min-h-[300px] md:min-h-[340px]">
      <button
        onClick={onClick}
        className={`group w-full rounded-xl border transition-colors min-h-[40px] border-white/10 bg-neutral-900/40 hover:bg-white/5 text-neutral-300 px-3 py-2.5 flex items-center justify-center gap-3 ${className}`}
      >
        <span className="text-md leading-tight font-normal font-adamant text-neutral-300 group-hover:text-neutral-100 transition-colors duration-200 text-center">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white/70 transform transition-transform duration-200 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// Horizontal carousel layout component
function ContentCarousel({
  items = [],
  className = "",
  cardVariant = "glass",
  carouselId,
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {},
  viewAllLabel = "Venture Deeper Into\nThe Woods",
}) {
  // Show first maxItems only if showViewAll is true, otherwise show all items
  const displayItems = useMemo(
    () => (showViewAll ? items.slice(0, maxItems) : items),
    [items, showViewAll, maxItems],
  );
  // Removed console logs to avoid noisy renders in production
  // Optimized for performance: memoize derived array

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        data-carousel-container
        data-carousel-id={carouselId}
        className="pt-4 pl-4 pr-4 flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      >
        {displayItems.map((item, index) => (
          <div
            key={item.id || index}
            className="shrink-0 snap-start w-[85vw] sm:w-[70vw] md:w-[500px] lg:w-[600px] max-w-[600px]"
          >
            <ContentCard variant={cardVariant} {...item} priority={index < 2} />
          </div>
        ))}

        {/* View All Button - only show if showViewAll is true and there are more items */}
        {showViewAll && items.length > maxItems && (
          <ViewAllButton onClick={onViewAllClick} label={viewAllLabel} />
        )}
      </div>
    </div>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentCarousel);

// PropTypes for ViewAllButton
ViewAllButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};

// PropTypes for ContentCarousel
ContentCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  cardVariant: PropTypes.string,
  carouselId: PropTypes.string,
  showViewAll: PropTypes.bool,
  maxItems: PropTypes.number,
  onViewAllClick: PropTypes.func,
  viewAllLabel: PropTypes.string,
};

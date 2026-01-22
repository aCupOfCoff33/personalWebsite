import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ContentCard from "./ContentCard";

// View All Projects Button Component - matches content card styling and size
function ViewAllButton({
  onClick,
  className = "",
  label = "View All Projects",
}) {
  return (
    <div className="snap-start shrink-0 w-64 md:w-72 flex items-center justify-center">
      <button
        onClick={onClick}
        className={`group relative isolate w-full h-full min-h-[300px] md:min-h-[340px] rounded-xl overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] ${className}`}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Border ring */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-900/60 to-neutral-900/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8 text-center gap-3">
          <span className="text-lg font-semibold leading-tight text-white group-hover:text-white transition-colors duration-200">
            {label}
          </span>

          <div className="flex items-center gap-2 text-white/70 group-hover:text-white/90 transition-colors duration-200">
            <span className="text-sm font-medium">Explore More</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="transform transition-transform duration-200 ease-out group-hover:translate-x-1"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
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
  viewAllLabel = "View All Projects",
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

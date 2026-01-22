import React, { useId } from "react";
import PropTypes from "prop-types";
import ContentCarousel from "./ContentCarousel";
import ContentGrid from "./ContentGrid";
import SectionHeading from "./SectionHeading";

// Main content section wrapper
function ContentSection({
  title,
  subtitle,
  items = [],
  layout = "carousel", // 'carousel' or 'grid'
  showControls = true,
  columns = { base: 1, md: 2, lg: 3, xl: 3, "2xl": 4 },
  cardVariant, // Auto-determined based on layout if not provided
  className = "",
  containerClassName = "",
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {},
  viewAllLabel = "View All Projects",
  ...props
}) {
  const carouselId = useId(); // Generate unique ID for this carousel instance
  // Removed dev logs to reduce noise/re-renders

  // Auto-determine card variant based on layout (prefer flatter "panel" style for carousel)
  const finalCardVariant =
    cardVariant || (layout === "carousel" ? "panel" : "panel");

  return (
    <section
      className={`relative w-full z-[1] bg-transparent ${className}`}
      {...props}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}
      >
        {/* Section Header */}
        {/* Fixed invalid z-index utility: use z-[1] instead of z-1 */}
        <div
          className={`z-[1] ${layout === "carousel" ? "flex items-center justify-between mb-12" : ""}`}
        >
          <SectionHeading
            title={title}
            subtitle={subtitle}
            className="mb-0"
            noContainer={true}
          />

          {/* Carousel Controls */}
          {layout === "carousel" && showControls && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  const carousel = document.querySelector(
                    `[data-carousel-id="${carouselId}"]`,
                  );
                  carousel?.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="flex items-center justify-center h-12 w-12 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="translate-x-[0.5px]"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => {
                  const carousel = document.querySelector(
                    `[data-carousel-id="${carouselId}"]`,
                  );
                  carousel?.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="flex items-center justify-center h-12 w-12 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="-translate-x-[0.5px]"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        {layout === "carousel" ? (
          <ContentCarousel
            items={items}
            cardVariant={finalCardVariant}
            carouselId={carouselId}
            showViewAll={showViewAll}
            maxItems={maxItems}
            onViewAllClick={onViewAllClick}
            viewAllLabel={viewAllLabel}
          />
        ) : (
          <ContentGrid
            items={items}
            columns={columns}
            cardVariant={finalCardVariant}
          />
        )}
      </div>
    </section>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentSection);

// PropTypes for clear component contracts
ContentSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.oneOf(["carousel", "grid"]),
  showControls: PropTypes.bool,
  columns: PropTypes.shape({
    base: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    "2xl": PropTypes.number,
  }),
  cardVariant: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  showViewAll: PropTypes.bool,
  maxItems: PropTypes.number,
  onViewAllClick: PropTypes.func,
  viewAllLabel: PropTypes.string,
};

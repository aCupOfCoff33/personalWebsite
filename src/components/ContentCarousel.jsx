import React, { useMemo } from 'react';
import ContentCard from './ContentCard';

// View All Projects Button Component - Pill Style
function ViewAllButton({ onClick, className = '' }) {
  return (
    <div className=" snap-start shrink-0 w-[90vw] sm:w-[48vw] md:w-[32vw] lg:w-[28vw] xl:w-[24vw] flex items-center justify-center min-h-[320px]">
      <button
        onClick={onClick}
        className={`
          group inline-flex items-center gap-3 px-6 py-3
          rounded-full border border-white/30
          backdrop-blur-xl bg-white/10
          hover:bg-white/20 hover:border-white/50
          transition-all duration-300 ease-out
          ${className}
        `}
      >
        {/* Text */}
        <span className="z-10 text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
          Venture Deeper into the Woods
        </span>
        
        {/* Arrow Icon */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
          className="text-white/70 group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-out"
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
  className = '',
  cardVariant = 'glass',
  carouselId,
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {}
}) {
  // Show first maxItems only if showViewAll is true, otherwise show all items
  const displayItems = useMemo(() => (showViewAll ? items.slice(0, maxItems) : items), [items, showViewAll, maxItems]);
  // Removed console logs to avoid noisy renders in production
  // Optimized for performance: memoize derived array
  
  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        data-carousel-container
        data-carousel-id={carouselId}
        className="pt-4 pl-4 pr-4 flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory will-change-transform [&::-webkit-scrollbar]:hidden"
      >
        {displayItems.map((item, index) => (
          <ContentCard
            key={item.id || index}
            variant={cardVariant}
            {...item}
          />
        ))}
        
        {/* View All Button - only show if showViewAll is true and there are more items */}
        {showViewAll && items.length > maxItems && (
          <ViewAllButton 
            onClick={onViewAllClick}
          />
        )}
      </div>
    </div>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentCarousel);

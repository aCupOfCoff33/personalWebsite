import React from 'react';
import ContentCard from './ContentCard';

// View All Projects Button Component
function ViewAllButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        group snap-start shrink-0 w-[90vw] sm:w-[48vw] md:w-[32vw] lg:w-[28vw] xl:w-[24vw]
        flex flex-col items-center justify-center
        rounded-3xl border-2 border-dashed border-white/20
        backdrop-blur-xl bg-white/5
        hover:bg-white/10 hover:border-white/30
        transition-all duration-300 ease-out
        min-h-[320px] relative overflow-hidden
        ${className}
      `}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6">
        <div className="text-white/70 group-hover:text-white transition-colors duration-300">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="transform group-hover:scale-110 transition-transform duration-300"
          >
            <path 
              d="M12 4v16m8-8H4" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
            View All Projects
          </h3>
          <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300">
            <span className="text-sm">Explore more</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
              className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out"
            >
              <path 
                d="M7 17L17 7M17 7H7M17 7V17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

// Horizontal carousel layout component
export default function ContentCarousel({ 
  items = [], 
  className = '',
  cardVariant = 'glass',
  carouselId,
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {}
}) {
  // Show first maxItems, then add ViewAll button if showViewAll is true
  const displayItems = showViewAll ? items.slice(0, maxItems) : items;
  
  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        data-carousel-container
        data-carousel-id={carouselId}
        className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
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

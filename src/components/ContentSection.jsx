import React, { useId } from 'react';
import { useReveal } from './useReveal';
import { HIDDEN } from './RevealStarter';
import ContentCarousel from './ContentCarousel';
import ContentGrid from './ContentGrid';

// Main content section wrapper
export default function ContentSection({
  title,
  subtitle,
  items = [],
  layout = 'carousel', // 'carousel' or 'grid'
  showGradientBar = true,
  showControls = true,
  columns = { base: 1, md: 2, lg: 3 },
  cardVariant, // Auto-determined based on layout if not provided
  className = '',
  containerClassName = '',
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {},
  ...props
}) {
  const revealRef = useReveal();
  const carouselId = useId(); // Generate unique ID for this carousel instance

  // Debug: Log items received by ContentSection
  console.log('ContentSection received items:', items.length);
  console.log('ContentSection items:', items.map(item => item.title));

  // Auto-determine card variant based on layout
  const finalCardVariant = cardVariant || (layout === 'carousel' ? 'glass' : 'story');

  return (
    <section 
      ref={revealRef} 
      className={`relative w-full z-1 py-24 bg-transparent ${className}`}
      {...props}
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {/* Section Header */}
        <div className={`mb-12 z-1 ${layout === 'carousel' ? 'flex items-center justify-between' : ''}`}>
          <div>
            {showGradientBar && (
              <span 
                data-reveal 
                className={`${HIDDEN} inline-block h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`} 
              />
            )}
            <h2 
              data-reveal 
              className={`${HIDDEN} mt-4 text-4xl font-semibold italic text-white`}
            >
              {title}
            </h2>
            {subtitle && (
              <p 
                data-reveal 
                className={`${HIDDEN} mt-2 max-w-xl text-lg text-gray-300`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Carousel Controls */}
          {layout === 'carousel' && showControls && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const carousel = document.querySelector(`[data-carousel-id="${carouselId}"]`);
                  carousel?.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                <span className="text-xl font-bold">‹</span>
              </button>
              <button
                onClick={() => {
                  const carousel = document.querySelector(`[data-carousel-id="${carouselId}"]`);
                  carousel?.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                <span className="text-xl font-bold">›</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        {layout === 'carousel' ? (
          <div data-reveal className={HIDDEN}>
            <ContentCarousel 
              items={items}
              cardVariant={finalCardVariant}
              carouselId={carouselId}
              showViewAll={showViewAll}
              maxItems={maxItems}
              onViewAllClick={onViewAllClick}
            />
          </div>
        ) : (
          <div data-reveal className={HIDDEN}>
            <ContentGrid 
              items={items}
              columns={columns}
              cardVariant={finalCardVariant}
            />
          </div>
        )}
      </div>
    </section>
  );
}

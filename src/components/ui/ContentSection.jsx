import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { useReveal } from '../../hooks/useReveal';
import { HIDDEN } from '../common/RevealStarter';
import ContentCarousel from './ContentCarousel';
import ContentGrid from './ContentGrid';
import SectionHeading from './SectionHeading';

// Main content section wrapper
function ContentSection({
  title,
  subtitle,
  items = [],
  layout = 'carousel', // 'carousel' or 'grid'
  showGradientBar = false,
  showControls = true,
  columns = { base: 1, md: 2, lg: 3 },
  cardVariant, // Auto-determined based on layout if not provided
  className = '',
  containerClassName = '',
  showViewAll = false,
  maxItems = 6,
  onViewAllClick = () => {},
  viewAllLabel = 'Venture Deeper into the Woods',
  ...props
}) {
  const revealRef = useReveal();
  const carouselId = useId(); // Generate unique ID for this carousel instance
  // Removed dev logs to reduce noise/re-renders

  // Auto-determine card variant based on layout (prefer flatter "panel" style for carousel)
  const finalCardVariant = cardVariant || (layout === 'carousel' ? 'panel' : 'panel');

  return (
    <section 
      ref={revealRef} 
      className={`relative w-full z-[1] py-24 bg-transparent ${className}`}
      {...props}
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {/* Section Header */}
        {/* Fixed invalid z-index utility: use z-[1] instead of z-1 */}
        <div className={`z-[1] ${layout === 'carousel' ? 'flex items-end justify-between mb-12' : ''}`}>
          <SectionHeading 
            title={title} 
            subtitle={subtitle} 
            className="mb-0"
          />

          {/* Carousel Controls */}
          {layout === 'carousel' && showControls && (
            <div className="flex space-x-2 mb-2">
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
              viewAllLabel={viewAllLabel}
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
// Optimized for performance by adding React.memo
export default React.memo(ContentSection);

// PropTypes for clear component contracts
ContentSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.oneOf(['carousel', 'grid']),
  showGradientBar: PropTypes.bool,
  showControls: PropTypes.bool,
  columns: PropTypes.shape({
    base: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
  }),
  cardVariant: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  showViewAll: PropTypes.bool,
  maxItems: PropTypes.number,
  onViewAllClick: PropTypes.func,
  viewAllLabel: PropTypes.string,
};

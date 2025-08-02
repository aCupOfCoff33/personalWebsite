import React from 'react';
import ContentCard from './ContentCard';

// Horizontal carousel layout component
export default function ContentCarousel({ 
  items = [], 
  showControls = true,
  className = '',
  cardVariant = 'glass'
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        data-carousel-container
        className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <ContentCard
            key={item.id || index}
            variant={cardVariant}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

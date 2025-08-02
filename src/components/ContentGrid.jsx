import React from 'react';
import ContentCard from './ContentCard';

// Grid layout component
export default function ContentGrid({ 
  items = [], 
  columns = { base: 1, md: 2, lg: 3 },
  className = '',
  cardVariant = 'story'
}) {
  // Generate responsive grid classes
  const gridCols = `grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

  return (
    <div className={`grid ${gridCols} gap-8 ${className}`}>
      {items.map((item, index) => (
        <ContentCard
          key={item.id || index}
          variant={cardVariant}
          {...item}
        />
      ))}
    </div>
  );
}

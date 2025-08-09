import React from 'react';
import ContentCard from './ContentCard';

// Grid layout component
function ContentGrid({ 
  items = [], 
  columns = { base: 1, md: 2, lg: 3 },
  className = '',
  cardVariant = 'story'
}) {
  // Generate responsive grid classes
  // Tailwind needs explicit class names to avoid purging; map allowed values
  const colClass = (n) => ({
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[n] || 'grid-cols-1');
  const gridCols = `${colClass(columns.base)} md:${colClass(columns.md)} lg:${colClass(columns.lg)}`;

  return (
    <div className={`grid ${gridCols} gap-8 ${className}`} style={{ contain: 'content' }}>
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
// Optimized for performance by adding React.memo
export default React.memo(ContentGrid);

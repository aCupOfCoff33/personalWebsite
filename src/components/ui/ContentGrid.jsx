import React from 'react';
import PropTypes from 'prop-types';
import ContentCard from './ContentCard';

// Grid layout component
function ContentGrid({ 
  items = [], 
  columns = { base: 1, md: 2, lg: 3, xl: 3, '2xl': 4 },
  className = '',
  cardVariant = 'story'
}) {
  // Generate responsive grid classes
  const allowed = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  // Explicit responsive mappings (included as literal strings so Tailwind picks them up)
  const responsiveMd = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };
  const responsiveLg = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  const responsiveXl = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
  };
  const responsive2xl = {
    1: '2xl:grid-cols-1',
    2: '2xl:grid-cols-2',
    3: '2xl:grid-cols-3',
    4: '2xl:grid-cols-4',
  };

  const gridCols = `${allowed[columns.base] || allowed[1]} ${responsiveMd[columns.md] || ''} ${responsiveLg[columns.lg] || ''} ${responsiveXl[columns.xl] || ''} ${responsive2xl[columns['2xl']] || ''}`.trim();

  return (
    <div className={`grid ${gridCols} gap-8 justify-items-center ${className}`} style={{ contain: 'content' }}>
      {items.map((item, index) => (
        <div key={item.id || index} className="w-full flex justify-center">
          <ContentCard
            variant={cardVariant}
            {...item}
          />
        </div>
      ))}
    </div>
  );
}
// Optimized for performance by adding React.memo
export default React.memo(ContentGrid);

// PropTypes for clear component contracts
ContentGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.shape({
    base: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    '2xl': PropTypes.number,
  }),
  className: PropTypes.string,
  cardVariant: PropTypes.string,
};
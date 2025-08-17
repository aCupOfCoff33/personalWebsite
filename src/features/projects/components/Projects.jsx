import React from 'react';
import ContentGrid from '../../../components/ui/ContentGrid';
import storiesData from '../../../constants/storiesData';

function Projects() {
  return (
    <div className="py-24 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold mb-6">Projects</h1>
        <p className="text-gray-300 mb-8">A collection of projects — click any card to learn more.</p>

        <ContentGrid
          items={storiesData}
          columns={{ base: 1, md: 2, lg: 4 }}
          cardVariant="glass"
        />
      </div>
    </div>
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Projects);

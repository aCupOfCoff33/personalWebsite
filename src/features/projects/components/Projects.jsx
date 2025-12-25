import React from 'react';
import ContentGrid from '../../../components/ui/ContentGrid';
import SectionHeading from '../../../components/ui/SectionHeading';
import storiesData from '../../../constants/storiesData';

function Projects() {
  return (
    <div className="text-white">
      <SectionHeading
        title="Projects"
        subtitle="A collection of projects — click any card to learn more."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ContentGrid
          items={storiesData}
          columns={{ base: 1, md: 2, lg: 3, xl: 3, '2xl': 4 }}
          cardVariant="glass"
        />
      </div>
    </div>
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Projects);

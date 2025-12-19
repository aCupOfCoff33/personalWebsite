import React from 'react';
import ContentGrid from '../../../components/ui/ContentGrid';
import SectionHeading from '../../../components/ui/SectionHeading';
import storiesData from '../../../constants/storiesData';

function Projects() {
  return (
    <div className="py-24 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="A collection of projects — click any card to learn more."
        />

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

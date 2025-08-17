import React from "react";
import ContentSection from './ContentSection';
import storiesData from '../constants/storiesData';

// Stories section using the reusable ContentSection with horizontal carousel layout
function Stories() {
  return (
    <ContentSection
      title="Notes from Hibernation"
      subtitle="Insights, learnings, and thoughts from my journey in tech."
      items={storiesData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
      cardVariant="panel" // Flat-modern panel style
    />
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Stories);

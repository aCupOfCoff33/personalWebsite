import React from "react";
import ContentSection from '../../../components/ui/ContentSection';
import storiesData from '../../../constants/storiesData';
import { useNavigate } from 'react-router-dom';

// Stories section using the reusable ContentSection with horizontal carousel layout
function Stories() {
  const navigate = useNavigate();
  return (
    <ContentSection
      title="Notes from Hibernation"
      subtitle="Insights, learnings, and thoughts from my journey in tech."
      items={storiesData}
      layout="carousel"
      showControls={true}
      cardVariant="panel"
      showViewAll={true}
      maxItems={7}
      onViewAllClick={() => navigate('/notes')}
      viewAllLabel={'Venture Deeper Into\nThe Woods'}
    />
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Stories);

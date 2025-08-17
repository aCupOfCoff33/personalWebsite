import React from "react";
import ContentSection from '../../ui/ContentSection';
import { useNavigate } from 'react-router-dom';
import projectsData from '../../../constants/projectsData';

// Selected Works section using the reusable ContentSection
function SelectedWorks() {
  const navigate = useNavigate();
  const handleViewAllClick = () => {
    navigate('/projects');
  };

  return (
    <ContentSection
      title="Things I've Built in My Cave"
      subtitle="Projects, roles, and highlights from my journey."
      items={projectsData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
      cardVariant="glass" // Use glass variant for horizontal carousel
      maxItems={6} // Show only first 6 items initially
      showViewAll={true} // Enable "View All Projects" button
      onViewAllClick={handleViewAllClick}
    />
  );
}

// Optimized for performance by adding React.memo
export default React.memo(SelectedWorks);

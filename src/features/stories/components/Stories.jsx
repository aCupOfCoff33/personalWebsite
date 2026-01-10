import React, { useState } from "react";
import ContentSection from "../../../components/ui/ContentSection";
import { contentService } from "../../../services/content";
import { useNavigate } from "react-router-dom";

// Stories section using the reusable ContentSection with horizontal carousel layout
function Stories() {
  const navigate = useNavigate();
  const [stories] = useState(() => {
    try {
      return contentService.getStories();
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  });

  return (
    <ContentSection
      title="Notes from Hibernation"
      subtitle="Insights, learnings, and thoughts from my journey in tech."
      items={stories}
      layout="carousel"
      showControls={true}
      cardVariant="panel"
      showViewAll={true}
      maxItems={7}
      onViewAllClick={() => navigate("/projects")}
      viewAllLabel={"Venture Deeper Into\nThe Woods"}
    />
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Stories);

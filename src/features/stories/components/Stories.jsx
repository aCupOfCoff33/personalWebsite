import React, { useState, useEffect } from "react";
import ContentSection from "../../../components/ui/ContentSection";
import { contentService } from "../../../services/content";
import { useNavigate } from "react-router-dom";

// Stories section using the reusable ContentSection with horizontal carousel layout
function Stories() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await contentService.getStories();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center text-white/60">Loading...</div>
      </div>
    );
  }

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

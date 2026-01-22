import React, { useState, useEffect } from "react";
import ContentSection from "../../../components/ui/ContentSection";
import { useNavigate } from "react-router-dom";
import { contentService } from "../../../services/content";
import { markForceScrollTop } from "../../../utils/scrollUtils";

// Selected Works section using the reusable ContentSection
function SelectedWorks() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await contentService.getProjects({ featured: true });
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewAllClick = React.useCallback(() => {
    markForceScrollTop();
    navigate("/projects");
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <ContentSection
      title="Things I've Built in My Cave"
      subtitle="Projects, roles, and highlights from my journey."
      items={projects}
      layout="carousel"
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

import React, { useState, useEffect } from "react";
import ContentGrid from "../../../components/ui/ContentGrid";
import SectionHeading from "../../../components/ui/SectionHeading";
import { contentService } from "../../../services/content";

function Projects() {
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
      <div className="text-white">
        <SectionHeading
          title="Projects"
          subtitle="A collection of projects — click any card to learn more."
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <SectionHeading
        title="Projects"
        subtitle="A collection of projects — click any card to learn more."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ContentGrid
          items={stories}
          columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 3 }}
          cardVariant="glass"
        />
      </div>
    </div>
  );
}

// Optimized for performance by adding React.memo
export default React.memo(Projects);

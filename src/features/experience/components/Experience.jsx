import React, { useState, useEffect } from "react";
import SectionHeading from "../../../components/ui/SectionHeading";
import ContentCard from "../../../components/ui/ContentCard";
import { contentService } from "../../../services/content";

// Helper: format date range as years
function formatYears(dateRange) {
  if (!dateRange) return "";
  const years = dateRange.match(/\d{4}/g);
  if (!years) return dateRange;
  const hasPresent = /present/i.test(dateRange);
  if (hasPresent) return `${years[0]}-Present`;
  if (years.length >= 2) return `${years[0]}-${years[years.length - 1]}`;
  return years[0];
}

// Main Experience component
const Experience = React.memo(() => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        // Fetch active experiences through centralized service
        const data = await contentService.getExperiences({ isActive: true });
        setExperiences(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-transparent">
        <SectionHeading title="Experience" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center text-white/60">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-transparent">
        <SectionHeading title="Experience" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center text-red-400">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-transparent">
      <SectionHeading title="Experience" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* List */}
        <div className="w-full flex flex-col">
          {experiences.map((exp) => (
            <ContentCard
              key={exp.id}
              variant="inline"
              title={exp.companyName}
              subtitle={exp.position ? `/ ${exp.position}` : undefined}
              dates={formatYears(exp.dateRange)}
              logo={exp.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Experience.displayName = "Experience";

export default Experience;

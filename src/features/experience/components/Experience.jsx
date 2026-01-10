import React, { useState } from "react";
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
  const [experiences] = useState(() => {
    try {
      // Fetch active experiences through centralized service
      return contentService.getExperiences({ isActive: true });
    } catch (err) {
      console.error("Error fetching experiences:", err);
      return [];
    }
  });

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

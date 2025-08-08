import React from 'react';
import { useReveal } from './useReveal';
import { HIDDEN } from './RevealStarter';

// Experience data structure designed for easy SQL/MongoDB migration
// Each entry represents a row/document that could be stored in a database
const experienceData = [
  {
    id: 'american-global-2025',
    companyName: 'American Global',
    position: 'Data Analytics & Strategy Intern',
    dateRange: 'May 2025 - August 2025',
    location: "Oakville, ON",
    description: 'One of the first interns on the Data Analytics team, contributing to impactful initiatives within the construction insurance sector.',
    technologies: ['Python', 'Power Tools', 'Data Analysis'],
    category: 'internship',
    sortOrder: 1,
    isActive: true,
    createdAt: '2025-08-02T00:00:00Z',
    updatedAt: '2025-08-02T00:00:00Z'
  },
  {
    id: 'western-developers-society-2023',
    companyName: 'Western Developers Society',
    position: 'Vice President of Developers',
    dateRange: 'Sept 2023 – Present',
    location: "University Campus",
    description: 'Led 120+ developers on AI/ML and robotics projects, driving innovation through agile methods and building competition-ready systems.',
    technologies: ['AI/ML', 'Robotics', 'Agile'],
    category: 'leadership',
    sortOrder: 2,
    isActive: true,
    createdAt: '2025-08-02T00:00:00Z',
    updatedAt: '2025-08-02T00:00:00Z'
  },
  {
    id: 'ivey-fintech-2024',
    companyName: 'Ivey FinTech',
    position: 'Consultant Analyst',
    dateRange: 'Sept 2024 – Present',
    location: "Ivey Business School",
    description: 'Provided strategic recommendations to enhance mortgage UX, integrate AI, and improve operational efficiency for a digital mortgage company.',
    technologies: ['UX', 'AI', 'FinTech'],
    category: 'leadership',
    sortOrder: 3,
    isActive: true,
    createdAt: '2025-08-02T00:00:00Z',
    updatedAt: '2025-08-02T00:00:00Z'
  },
  {
    id: 'esdc-2024',
    companyName: 'ESDC / Government of Canada',
    position: 'Financial Services Intern',
    dateRange: 'May 2024 – Aug 2024',
    location: "North York, ON",
    description: 'Streamlined financial processes using SAP and Power BI, clearing $150,000 in suspense transactions and optimizing workflows across Canada.',
    technologies: ['SAP', 'Power BI', 'Finance'],
    category: 'internship',
    sortOrder: 4,
    isActive: true,
    createdAt: '2025-08-02T00:00:00Z',
    updatedAt: '2025-08-02T00:00:00Z'
  },
  {
    id: 'minimart-2023',
    companyName: 'Minimart',
    position: 'Business Analyst',
    dateRange: 'Sept 2022 – Mar 2023',
    location: "London, ON",
    description: 'Designed financial models and collaborated with stakeholders to enable sustainable growth, increasing profitability in competitive markets.',
    technologies: ['Business Analysis', 'Finance', 'Sustainability'],
    category: 'project',
    sortOrder: 5,
    isActive: true,
    createdAt: '2025-08-02T00:00:00Z',
    updatedAt: '2025-08-02T00:00:00Z'
  }
];


// Individual experience item component
const ExperienceItem = React.memo(({ experience, index }) => {
  const revealRef = useReveal();

  return (
    <div 
      ref={revealRef}
      className="group flex items-start justify-between py-6 border-b border-gray-700 last:border-b-0 hover:bg-gray-800/50 transition-colors duration-200 px-4 -mx-4 rounded-lg"
    >
      {/* Left side: Number and Content */}
      <div className="flex items-start space-x-6 flex-1 min-w-0">
        {/* Number */}
        <div 
          data-reveal
          className={`${HIDDEN} flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full flex items-center justify-center`}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            data-reveal
            className={`${HIDDEN} text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors`}
          >
            {experience.companyName}
          </h3>
          <p 
            data-reveal
            className={`${HIDDEN} text-base text-gray-300 mb-2`}
          >
            {experience.position}
          </p>
          {experience.location && (
            <p 
              data-reveal
              className={`${HIDDEN} text-sm text-gray-400 mb-2`}
            >
              📍 {experience.location}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Date */}
      <div className="flex-shrink-0 text-right ml-4">
        <span 
          data-reveal
          className={`${HIDDEN} text-sm md:text-base text-gray-400 font-medium`}
        >
          {experience.dateRange}
        </span>
      </div>
    </div>
  );
});

ExperienceItem.displayName = 'ExperienceItem';

// Main Experience component
const Experience = () => {
  const sectionRef = useReveal();

  // Filter and sort data (useful for database queries later)
  const activeExperiences = experienceData
    .filter(exp => exp.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-transparent py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Following ContentSection pattern */}
        <div className="mb-12">
          <span 
            data-reveal 
            className={`${HIDDEN} inline-block h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`} 
          />
          <h2 
            data-reveal 
            className={`${HIDDEN} mt-4 text-4xl font-semibold italic text-white`}
          >
            Experience
          </h2>
          <p 
            data-reveal 
            className={`${HIDDEN} mt-2 max-w-xl text-lg text-gray-300`}
          >
            A timeline of my professional journey, internships, and leadership roles.
          </p>
        </div>

        {/* Experience List */}
        <div 
          data-reveal
          className={`${HIDDEN} bg-gray-900/50 rounded-2xl shadow-sm border border-gray-800 p-6 md:p-8`}
        >
          <div className="space-y-0">
            {activeExperiences.map((experience, index) => (
              <ExperienceItem 
                key={experience.id} 
                experience={experience} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Optional: Statistics or Call to Action */}
        <div 
          data-reveal
          className={`${HIDDEN} mt-12 text-center`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {activeExperiences.filter(exp => exp.category === 'internship').length} Internships
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              {activeExperiences.filter(exp => exp.category === 'leadership').length} Leadership Role
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              {activeExperiences.filter(exp => exp.category === 'research').length} Research Position
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

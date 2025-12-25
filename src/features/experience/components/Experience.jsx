import React from 'react';
import SectionHeading from '../../../components/ui/SectionHeading';
// Figma-aligned simplified layout without reveal animations

// Experience data structure designed for easy SQL/MongoDB migration
// Each entry represents a row/document that could be stored in a database
const experienceData = [
  {
    id: 'american-global-2025',
    companyName: 'American Global',
    position: 'Data Analytics & Strategy Intern',
    dateRange: 'May 2025 - Present',
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFxOWSzcQlx7w/company-logo_200_200/company-logo_200_200/0/1672776000338/american_global_llc_logo?e=2147483647&v=beta&t=6eASPMK3qET6z-fVO8yv4YWrhgf7l7wjaAwu_iF8q2s',
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
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEuc4ov6cWAtw/company-logo_200_200/company-logo_200_200/0/1736450937302/western_dev_society_logo?e=2147483647&v=beta&t=oYKXg7b_w-tYzt847EjXLG_VgKi9qecWt6vndmafe_g',
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
    logo: 'https://miro.medium.com/v2/resize:fit:512/1*429tXOeB5sYvQ37L-zasBQ.jpeg',
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
    logo: 'https://yt3.googleusercontent.com/ddUhKuKyfw_os57z9BTnVKo5FK_tWb5KD6ujp3nJdg1NqbE9fLf98zOH0ChubscuGblCKfvT=s900-c-k-c0x00ffffff-no-rj',
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
    logo: 'https://banner2.cleanpng.com/20180630/xcw/aax01zjeu.webp',
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


// Helper: format date range as years
function formatYears(dateRange) {
  if (!dateRange) return '';
  const years = dateRange.match(/\d{4}/g);
  if (!years) return dateRange;
  const hasPresent = /present/i.test(dateRange);
  if (hasPresent) return `${years[0]}-Present`;
  if (years.length >= 2) return `${years[0]}-${years[years.length - 1]}`;
  return years[0];
}

// Main Experience component
const Experience = React.memo(() => {
  // Filter and sort data
  const activeExperiences = experienceData
    .filter(exp => exp.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="w-full bg-transparent">
      <SectionHeading title="Experience" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* List */}
        <div className="w-full flex flex-col">
          {activeExperiences.map((exp) => (
            <div
              key={exp.id}
              className="w-full py-5 md:py-6 px-4 sm:px-5 relative inline-flex items-center gap-4 rounded-xl overflow-hidden
                         after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px
                         after:bg-gradient-to-r after:from-white/10 after:to-transparent
                         first:before:content-[''] first:before:absolute first:before:left-0 first:before:right-0 first:before:top-0 first:before:h-px
                         first:before:bg-gradient-to-r first:before:from-white/10 first:before:to-transparent
                         hover:bg-white/5 transition-colors"
            >
              {/* Logo */}
              <div className="size-10 sm:size-[42px] p-[5px] rounded-[10px] flex justify-center items-center shadow-[0_1px_8px_rgba(255,255,255,0.08)] bg-gradient-to-br from-white to-white/90 flex-shrink-0">
                <img className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain" src={exp.logo} alt="" loading="lazy" decoding="async" />
              </div>

              {/* Company / Role */}
              <div className="flex flex-wrap items-baseline gap-[6px]">
                <div className="text-white text-xl md:text-2xl font-normal font-adamant">{exp.companyName}</div>
                {exp.position && (
                  <div className="text-white/70 md:text-white/75 text-base md:text-lg font-normal font-adamant">{`/ ${exp.position}`}</div>
                )}
              </div>

              {/* Years */}
              <div className="ml-auto text-right text-white/70 md:text-white/80 text-xs sm:text-sm font-normal font-adamant drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                   style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatYears(exp.dateRange)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Experience; // Already memoized above

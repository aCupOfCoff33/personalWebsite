import React from 'react';
import { resumeData } from '../../../constants/resumeData';

// Download icon component
const DownloadIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M10 13L6 9H8V3H12V9H14L10 13Z" 
      fill="currentColor"
    />
    <path 
      d="M17 15V17H3V15H1V17C1 18.1 1.9 19 3 19H17C18.1 19 19 18.1 19 17V15H17Z" 
      fill="currentColor"
    />
  </svg>
);

export default function Resume() {
  const { personalInfo, workExperience } = resumeData;
  
  // Timeline configuration
  const currentYear = new Date().getFullYear();
  const startTimelineYear = 2021;
  const endTimelineYear = currentYear + 1;
  const years = Array.from(
    { length: endTimelineYear - startTimelineYear + 1 }, 
    (_, i) => endTimelineYear - i
  );
  const ROW_HEIGHT = 80; // pixels per year

  // Format dates for display
  const formatJobDates = (start, end) => {
    const startDate = new Date(`${start}-01T12:00:00Z`);
    const startMonth = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const startYear = startDate.getFullYear().toString().slice(-2);

    if (end === 'present') {
      return `${startMonth} ${startYear} - PRESENT`;
    }

    const endDate = new Date(`${end}-01T12:00:00Z`);
    const endMonth = endDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const endYear = endDate.getFullYear().toString().slice(-2);

    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  // Calculate layout for each job - SINGLE COLUMN, NO OVERLAPS
  const jobsWithLayout = workExperience
    .map(job => {
      if (!job.startDate) return null;

      const start = new Date(`${job.startDate}-01T12:00:00Z`);
      const end = job.endDate === 'present' ? new Date() : new Date(`${job.endDate}-01T12:00:00Z`);

      // Calculate position based on year (from the TOP of timeline which is endTimelineYear)
      const startFraction = start.getFullYear() + start.getMonth() / 12;
      const endFraction = end.getFullYear() + end.getMonth() / 12;

      // Calculate top position: distance from the start of timeline (which is endTimelineYear at top)
      // If job starts in 2025 and timeline starts at 2026, it's 1 year down = 80px
      const topOffset = (endTimelineYear - startFraction) * ROW_HEIGHT;
      const bottomOffset = (endTimelineYear - endFraction) * ROW_HEIGHT;
      const height = topOffset - bottomOffset;

      // Minimum height for readability
      const minHeight = 50;

      return {
        ...job,
        layout: {
          top: bottomOffset, // Position from top where job ENDS (more recent)
          height: Math.max(height, minHeight),
        },
        displayDate: formatJobDates(job.startDate, job.endDate),
        isCompact: Math.max(height, minHeight) < 120,
      };
    })
    .filter(Boolean);

  // Split into Work Experience and Club Experience
  const workExperienceIds = ['american-global-2025', 'esdc-2024', 'minimart-2023'];
  
  const workJobs = jobsWithLayout.filter(job => workExperienceIds.includes(job.id));
  const clubJobs = jobsWithLayout.filter(job => !workExperienceIds.includes(job.id));

  return (
    <section className="w-full bg-transparent py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="inline-flex flex-col items-start gap-1">
            <h1 className="text-white text-4xl lg:text-5xl font-normal font-adamant tracking-wide">
              CAREER JOURNEY
            </h1>
          </div>

          <a
            href={personalInfo.resumeUrl}
            download
            aria-label="Download resume"
            className="group flex w-full sm:w-auto justify-center items-center gap-3 px-4 py-3 rounded-xl
                       bg-white/5 hover:bg-white/10
                       ring-1 ring-white/10 hover:ring-white/20
                       transition-all duration-300 max-w-md mx-auto sm:mx-0"
          >
            <span className="text-white text-base sm:text-lg font-normal font-adamant">
              Download Resume
            </span>
            <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <DownloadIcon />
            </div>
          </a>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Years and Horizontal Lines */}
          <div className="space-y-20">
            {years.map((year) => (
              <div key={year} className="relative flex items-center gap-8">
                <div className="flex-shrink-0 w-12">
                  <div className="text-white/70 text-xl font-normal font-adamant">
                    {year}
                  </div>
                </div>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="absolute top-0 left-16 right-0 h-full pointer-events-none">
            <div className="relative h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN - Work Experience */}
              <div className="relative">
                <div className="mb-8 pointer-events-auto">
                  <h2 className="text-white text-xl font-semibold font-adamant">Work Experience</h2>
                </div>
                <div className="relative h-full">
                  {workJobs.map(({ id, company, position, logo, layout, displayDate, isCompact }) => (
                    <div
                      key={id}
                      className="absolute w-full pointer-events-auto"
                      style={{
                        top: `${layout.top}px`,
                        minHeight: `${layout.height}px`,
                      }}
                    >
                      {isCompact ? (
                        // COMPACT CARD STYLE
                        <div className="bg-white/5 rounded-xl px-4 py-1.5 ring-1 ring-white/10 
                                        hover:bg-white/10 hover:ring-white/20 transition-all duration-300 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="size-6 p-0.5 bg-white rounded flex justify-center items-center 
                                          shadow-md flex-shrink-0">
                              <img 
                                className="w-full h-full rounded object-contain" 
                                src={logo} 
                                alt={`${company} logo`}
                                loading="lazy"
                              />
                            </div>

                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <h3 className="text-white text-sm font-semibold font-adamant truncate">
                                {position}
                              </h3>
                              <span className="text-white/40 text-sm">•</span>
                              <p className="text-white/70 text-sm font-normal font-adamant truncate">
                                {company}
                              </p>
                            </div>

                            <div className="text-white/50 text-[10px] font-normal font-adamant uppercase tracking-wider flex-shrink-0">
                              {displayDate}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // EXPANDED CARD STYLE
                        <div className="bg-white/5 rounded-xl px-6 py-5 ring-1 ring-white/10 
                                        hover:bg-white/10 hover:ring-white/20 transition-all duration-300 shadow-lg">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="size-12 p-1.5 bg-white rounded-lg flex justify-center items-center 
                                          shadow-md flex-shrink-0">
                              <img 
                                className="w-full h-full rounded object-contain" 
                                src={logo} 
                                alt={`${company} logo`}
                                loading="lazy"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-white text-base font-semibold font-adamant">
                              {position}
                            </h3>
                            <p className="text-white/70 text-sm font-normal font-adamant">
                              {company}
                            </p>
                            
                            <div className="pt-2">
                              <p className="text-white/50 text-[10px] font-normal font-adamant uppercase tracking-wider">
                                {displayDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN - Club Experience */}
              <div className="relative">
                <div className="mb-8 pointer-events-auto">
                  <h2 className="text-white text-xl font-semibold font-adamant">Club Experience</h2>
                </div>
                <div className="relative h-full">
                  {clubJobs.map(({ id, company, position, logo, layout, displayDate, isCompact }) => (
                    <div
                      key={id}
                      className="absolute w-full pointer-events-auto"
                      style={{
                        top: `${layout.top}px`,
                        minHeight: `${layout.height}px`,
                      }}
                    >
                      {isCompact ? (
                        // COMPACT CARD STYLE
                        <div className="bg-white/5 rounded-xl px-4 py-1.5 ring-1 ring-white/10 
                                        hover:bg-white/10 hover:ring-white/20 transition-all duration-300 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="size-6 p-0.5 bg-white rounded flex justify-center items-center 
                                          shadow-md flex-shrink-0">
                              <img 
                                className="w-full h-full rounded object-contain" 
                                src={logo} 
                                alt={`${company} logo`}
                                loading="lazy"
                              />
                            </div>

                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <h3 className="text-white text-sm font-semibold font-adamant truncate">
                                {position}
                              </h3>
                              <span className="text-white/40 text-sm">•</span>
                              <p className="text-white/70 text-sm font-normal font-adamant truncate">
                                {company}
                              </p>
                            </div>

                            <div className="text-white/50 text-[10px] font-normal font-adamant uppercase tracking-wider flex-shrink-0">
                              {displayDate}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // EXPANDED CARD STYLE
                        <div className="bg-white/5 rounded-xl px-6 py-5 ring-1 ring-white/10 
                                        hover:bg-white/10 hover:ring-white/20 transition-all duration-300 shadow-lg">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="size-12 p-1.5 bg-white rounded-lg flex justify-center items-center 
                                          shadow-md flex-shrink-0">
                              <img 
                                className="w-full h-full rounded object-contain" 
                                src={logo} 
                                alt={`${company} logo`}
                                loading="lazy"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-white text-base font-semibold font-adamant">
                              {position}
                            </h3>
                            <p className="text-white/70 text-sm font-normal font-adamant">
                              {company}
                            </p>
                            
                            <div className="pt-2">
                              <p className="text-white/50 text-[10px] font-normal font-adamant uppercase tracking-wider">
                                {displayDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

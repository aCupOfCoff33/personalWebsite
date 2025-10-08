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

  return (
    <section className="w-full bg-transparent py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Title */}
          <div className="inline-flex flex-col items-start gap-1">
            <h1 className="text-white text-4xl lg:text-5xl font-normal font-adamant">Work</h1>
            <h2 className="text-white text-3xl lg:text-4xl font-normal font-adamant">Experience</h2>
          </div>

          {/* Download Resume (responsive) */}
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

        {/* Work Experience Section */}
        <div className="space-y-16">
          {workExperience.map((job, index) => (
            <div 
              key={job.id}
              className="relative"
            >
              {/* Company Header - Full Width Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
                {/* Logo */}
                <div className="size-14 p-[5px] bg-white rounded-[10px] flex justify-center items-center 
                              shadow-lg flex-shrink-0">
                  <img 
                    className="w-12 h-12 rounded-md object-contain" 
                    src={job.logo} 
                    alt={`${job.company} logo`}
                    loading="lazy"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-2xl font-normal font-adamant">
                      {job.company}
                    </h3>
                    <p className="text-white/70 text-xl font-normal font-adamant">
                      {job.position}
                    </p>
                  </div>
                  
                  <div className="text-white/60 text-base sm:text-lg font-normal font-adamant 
                                sm:text-right whitespace-nowrap">
                    {job.dateRange}
                  </div>
                </div>
              </div>

              {/* Highlights in 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {job.highlights.map((highlight, highlightIndex) => {
                  // Extract bolded heading from the highlight (format: "Heading - Description")
                  const parts = highlight.split(' - ');
                  const heading = parts.length > 1 ? parts[0] : '';
                  const description = parts.length > 1 ? parts.slice(1).join(' - ') : highlight;
                  
                  return (
                    <div
                      key={highlightIndex}
                      className="relative p-px"
                    >
                      {/* Card content - glassmorphic, no hover highlight */}
                      <div className="relative bg-white/5 rounded-xl px-6 py-6
                                    ring-1 ring-white/10 transition-all duration-300 h-full">
                        {heading ? (
                          <>
                            <p className="text-white text-lg lg:text-xl font-semibold font-adamant mb-3 leading-relaxed">
                              {heading}
                            </p>
                            <p className="text-white/80 text-base lg:text-lg font-normal font-adamant leading-relaxed">
                              {description}
                            </p>
                          </>
                        ) : (
                          <p className="text-white/80 text-base lg:text-lg font-normal font-adamant leading-relaxed">
                            {highlight}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divider line between jobs (except last) */}
              {index < workExperience.length - 1 && (
                <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

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

const TimelineColumn = ({ jobs }) => (
  <div className="relative h-full">
    {jobs.map(({ id, company, position, logo, layout, displayDate, isCompact }) => (
      <React.Fragment key={id}>
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{
            top: `${layout.barTop}px`,
            height: `${layout.barHeight}px`,
          }}
        >
          <div className="w-full h-full rounded-full bg-white/8 ring-1 ring-white/10" />
        </div>

        <div
          className="absolute inset-x-0 pointer-events-auto transition-transform duration-200 hover:scale-[1.02]"
          style={{
            top: `${layout.cardTop}px`,
            height: `${layout.cardHeight}px`,
          }}
        >
          {isCompact ? (
            <div className="h-full flex items-center bg-white/5 rounded-xl px-4 py-2 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/15 transition-all duration-300 shadow-lg">
              <div className="flex items-center gap-3 w-full">
                <div className="size-8 p-1 bg-white rounded-md flex justify-center items-center shadow-md flex-shrink-0">
                  <img
                    src={logo}
                    alt={`${company} logo`}
                    className="w-full h-full object-contain rounded-sm"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-baseline gap-2">
                  <h3 className="text-white text-sm font-semibold font-adamant truncate">
                    {position}
                  </h3>
                  <span className="text-white/40 text-sm">•</span>
                  <p className="text-white/70 text-sm font-normal font-adamant truncate">
                    {company}
                  </p>
                </div>
                <div className="text-white/50 text-xs font-mono uppercase tracking-wider flex-shrink-0">
                  {displayDate}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between bg-white/5 rounded-xl px-5 py-4 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/15 transition-all duration-300 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="size-12 p-1.5 bg-white rounded-lg flex justify-center items-center shadow-md">
                  <img
                    src={logo}
                    alt={`${company} logo`}
                    className="w-full h-full object-contain rounded"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-base font-semibold font-adamant truncate">
                    {position}
                  </h3>
                  <p className="text-white/70 text-sm font-normal font-adamant truncate">
                    {company}
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-xs font-mono uppercase tracking-wider">
                {displayDate}
              </p>
            </div>
          )}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default function Resume() {
  const { personalInfo, workExperience } = resumeData;

  // --- CONFIGURATION ---
  const ROW_HEIGHT = 100; // Vertical spacing between timeline markers
  const TIMELINE_PADDING = 56;
  const CARD_GAP = 32;
  const COMPACT_CARD_HEIGHT = 72;
  const EXPANDED_CARD_HEIGHT = 184;
  const BAR_MIN_HEIGHT = 10;
  const timelineStartYear = 2021;
  const now = new Date();
  const currentUtcYear = now.getUTCFullYear();
  const currentUtcMonth = now.getUTCMonth();
  const timelineStartDate = new Date(Date.UTC(timelineStartYear, 0, 1));
  const timelineEndDate = new Date(Date.UTC(currentUtcYear, currentUtcMonth + 1, 0, 23, 59, 59, 999));
  const totalTimelineDuration = Math.max(1, timelineEndDate.getTime() - timelineStartDate.getTime());
  const years = [
    'PRESENT',
    ...Array.from(
      { length: currentUtcYear - timelineStartYear + 1 },
      (_, i) => currentUtcYear - i
    ),
  ];
  const baseTimelineHeight = Math.max(ROW_HEIGHT, (years.length - 1) * ROW_HEIGHT);
  const timelineHeight = baseTimelineHeight + TIMELINE_PADDING * 2;
  const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.4375;

  // --- HELPERS ---
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });

  const parseMonthToDate = (value, { endOfMonth = false } = {}) => {
    if (!value) return null;
    const [year, month] = value.split('-').map(Number);
    if (!year || !month) return null;
    if (endOfMonth) {
      return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    }
    return new Date(Date.UTC(year, month - 1, 1));
  };

  const clampDateToTimeline = (date) => {
    if (!date) return null;
    const time = date.getTime();
    if (time <= timelineStartDate.getTime()) return new Date(timelineStartDate);
    if (time >= timelineEndDate.getTime()) return new Date(timelineEndDate);
    return date;
  };

  const getOffsetFromTop = (date) => {
    const clamped = clampDateToTimeline(date);
    if (!clamped) return 0;
    const ratio = (timelineEndDate.getTime() - clamped.getTime()) / totalTimelineDuration;
    return TIMELINE_PADDING + ratio * baseTimelineHeight;
  };

  const formatJobDates = (start, end) => {
    const startDate = parseMonthToDate(start);
    if (!startDate) return '';

    const startMonthLabel = monthFormatter.format(startDate).toUpperCase();
    const startYearLabel = startDate.getUTCFullYear().toString().slice(-2);

    if (end === 'present') {
      const endMonthLabel = monthFormatter.format(timelineEndDate).toUpperCase();
      const endYearLabel = timelineEndDate.getUTCFullYear().toString().slice(-2);
      return `${startMonthLabel} ${startYearLabel} - ${endMonthLabel} ${endYearLabel} (PRESENT)`;
    }

    const endDate = parseMonthToDate(end);
    if (!endDate) {
      return `${startMonthLabel} ${startYearLabel}`;
    }

    const endMonthLabel = monthFormatter.format(endDate).toUpperCase();
    const endYearLabel = endDate.getUTCFullYear().toString().slice(-2);

    return `${startMonthLabel} ${startYearLabel} - ${endMonthLabel} ${endYearLabel}`;
  };

  // --- LAYOUT CALCULATION (USING PRECISE DATE POSITIONS) ---
  const jobsWithLayout = workExperience
    .map(job => {
      if (!job.startDate) return null;

      const startDate = parseMonthToDate(job.startDate);
      if (!startDate) return null;

      const rawEndDate = job.endDate === 'present'
        ? timelineEndDate
        : parseMonthToDate(job.endDate, { endOfMonth: true });
      if (!rawEndDate) return null;

      const clampedStart = clampDateToTimeline(startDate);
      const clampedEnd = clampDateToTimeline(rawEndDate);

      const barTop = getOffsetFromTop(clampedEnd);
      const barBottom = getOffsetFromTop(clampedStart);
      const barHeight = Math.max(barBottom - barTop, BAR_MIN_HEIGHT);
      const durationInMonths = Math.max((clampedEnd.getTime() - clampedStart.getTime()) / MS_PER_MONTH, 0);
      const isCompact = durationInMonths < 2;

      return {
        ...job,
        layout: { barTop, barBottom, barHeight },
        displayDate: formatJobDates(job.startDate, job.endDate),
        isCompact,
      };
    })
  .filter(Boolean) // Remove invalid jobs
  .sort((a, b) => a.layout.barTop - b.layout.barTop); // Sort by most recent end date

  const stackColumnCards = (jobs) => {
    let lastBottom = -Infinity;

    return jobs.map(job => {
      const cardHeight = job.isCompact ? COMPACT_CARD_HEIGHT : EXPANDED_CARD_HEIGHT;
      let cardTop = Math.max(job.layout.barTop - cardHeight / 2, 0);

      if (lastBottom !== -Infinity) {
        cardTop = Math.max(cardTop, lastBottom + CARD_GAP);
      }

      if (cardTop + cardHeight > timelineHeight) {
        cardTop = Math.max(timelineHeight - cardHeight, 0);
      }

      cardTop = Math.max(cardTop, 0);

      lastBottom = cardTop + cardHeight;

      return {
        ...job,
        layout: {
          ...job.layout,
          cardTop,
          cardHeight,
        },
      };
    });
  };

  // Split into categories using the new data field
  const workJobs = stackColumnCards(jobsWithLayout.filter(job => job.category === 'work'));
  const clubJobs = stackColumnCards(jobsWithLayout.filter(job => job.category === 'club'));

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
          <div className="relative" style={{ height: timelineHeight }}>
            <div
              className="absolute inset-x-0"
              style={{ top: TIMELINE_PADDING, bottom: TIMELINE_PADDING }}
            >
              <div className="flex flex-col justify-between h-full">
                {years.map((year) => (
                  <div key={year} className="relative flex items-center gap-8">
                    <div className="flex-shrink-0 w-16">
                      <div className="text-white/70 text-xl font-normal font-adamant">
                        {year}
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div
            className="absolute top-0 left-16 right-0 pointer-events-none"
            style={{ height: timelineHeight }}
          >
            <div className="relative h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TimelineColumn jobs={workJobs} />
              <TimelineColumn jobs={clubJobs} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

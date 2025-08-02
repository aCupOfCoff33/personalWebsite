import React from 'react';

// Base card component that can be styled differently based on variant
export default function ContentCard({ 
  title, 
  subtitle, 
  dates, 
  description, 
  image, 
  logo, // Add logo prop
  accent = 'blue',
  variant = 'glass', // 'glass' or 'story'
  href = '#',
  className = '',
  readTime,
  category,
  ...props 
}) {
  // Accent color mapping
  const accentMap = {
    blue: { ring: 'ring-blue-500', bar: 'bg-blue-500', tag: 'text-blue-400' },
    red: { ring: 'ring-red-500', bar: 'bg-red-500', tag: 'text-red-400' },
    emerald: { ring: 'ring-emerald-500', bar: 'bg-emerald-500', tag: 'text-emerald-400' },
    orange: { ring: 'ring-orange-500', bar: 'bg-orange-500', tag: 'text-orange-400' },
    cyan: { ring: 'ring-cyan-500', bar: 'bg-cyan-500', tag: 'text-cyan-400' },
    purple: { ring: 'ring-purple-500', bar: 'bg-purple-500', tag: 'text-purple-400' },
  };

  const { ring, bar, tag } = accentMap[accent] || accentMap.blue;

  // Glass card variant (for Selected Works)
  if (variant === 'glass') {
    return (
      <a
        href={href}
        className={`
          group snap-start shrink-0 w-[90vw] sm:w-[48vw] md:w-[32vw] lg:w-[28vw] xl:w-[24vw]
          flex flex-col overflow-hidden rounded-3xl
          backdrop-blur-xl bg-white/5
          shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-150
          hover:shadow-xl hover:scale-[1.02] focus-visible:outline-none
          focus-visible:ring-2 focus-visible:${ring}
          ${className}
        `}
        {...props}
      >
        {/* Static accent bar */}
        <span className={`${bar} absolute inset-px rounded-[calc(1.5rem-1px)] opacity-0 transition`} />
        
        {/* Image */}
        <img src={image} alt={title} className="w-full aspect-video object-cover" />
        
        {/* Glass footer */}
        <div className="flex flex-col gap-1 px-5 py-4 bg-black/60 backdrop-blur-md">
          {/* Company title with logo */}
          <div className="flex items-center gap-3">
            {logo && (
              <img 
                src={logo} 
                alt={`${title} logo`} 
                className="w-8 h-8 rounded-lg group-hover:rounded-md transition-all duration-300 flex-shrink-0" 
              />
            )}
            <h3 className="text-base font-semibold text-white truncate">{title}</h3>
          </div>
          <p className="text-sm text-gray-300 truncate">{subtitle}</p>
          {dates && <p className="text-xs text-gray-500">{dates}</p>}
          <p className="mt-2 text-sm text-gray-400">{description}</p>
          <span className={`mt-3 inline-block text-xs font-medium ${tag}`}>View case →</span>
        </div>
      </a>
    );
  }

  // Story card variant (for Stories grid)
  if (variant === 'story') {
    return (
      <a
        href={href}
        className={`
          group block relative overflow-hidden rounded-2xl
          bg-white shadow-sm border border-gray-200
          hover:shadow-lg hover:scale-[1.02] transition-all duration-200
          ${className}
        `}
        {...props}
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        {/* Content */}
        <div className="p-6">
          {dates && readTime && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span>{dates}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
          )}
          
          {description && (
            <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
          )}
          
          {category && (
            <div className={`inline-block mt-4 px-3 py-1 text-xs rounded-full ${tag} bg-current/10`}>
              {category}
            </div>
          )}
        </div>
      </a>
    );
  }

  // Default fallback
  return null;
}

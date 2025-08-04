import React from 'react';

// Base card component that can be styled differently based on variant
export default function ContentCard({ 
  title, 
  subtitle, 
  dates, 
  image, 
  logo,
  gradient = 'bg-gradient-to-r from-cyan-400 to-blue-500', // Dynamic gradient prop
  variant = 'glass', // 'glass' or 'story'
  href = '#',
  className = '',
  readTime,
  ...props 
}) {
  // Extract tag color from gradient for categories


  // Glass card variant (for Selected Works) - New Glassmorphism Design
  if (variant === 'glass') {
    return (
      <div className={`
        group snap-start shrink-0 w-[340px] h-[520px]
        relative
        transition-transform duration-300 ease-out
        hover:scale-[1.02]
        will-change-transform
        transform-gpu
        isolation-isolate
        p-1
        ${className}
      `}>
        {/* Background gradient layer at 20% opacity */}
        <div className={`
          absolute inset-1 rounded-[47px] ${gradient} opacity-20
        `} />
        
        {/* Glassmorphism card with white border */}
        <a
          href={href}
          className={`
            relative w-full h-full rounded-[48px] 
            border-[2px] border-solid border-white
            backdrop-blur-xl bg-gradient-to-b from-white/40 to-white/10
            shadow-[0_8px_24px_rgba(0,0,0,0.3)]
            transition-shadow duration-300 ease-out
            group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            overflow-hidden
            p-3
            flex flex-col
            will-change-auto
            box-border
          `}
          {...props}
        >
          {/* Large company gradient header taking most of the space */}
          <div className={`
            flex-1 min-h-[340px] mb-6 rounded-[40px] ${gradient}
          `} />
          
          {/* Content at bottom */}
          <div className="flex-shrink-0">
            {/* Company logo and name */}
            <div className="flex items-center gap-3 mb-4">
              {logo && (
                <img 
                  src={logo} 
                  alt={`${title} logo`} 
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0" 
                />
              )}
              <h3 className="text-xl font-semibold text-white leading-tight">{title}</h3>
            </div>
            
            {/* Role - only show if it exists */}
            {subtitle && (
              <p className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">{subtitle}</p>
            )}
            
            {/* Dates */}
            {dates && (
              <p className="text-sm font-semibold text-white opacity-90 mb-3">{dates}</p>
            )}
          </div>
        </a>
      </div>
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
          
    
        </div>
      </a>
    );
  }

  // Default fallback
  return null;
}

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * PhotoMosaic - Dynamic gallery component that arranges images aesthetically
 * 
 * Uses a row-based packing algorithm that:
 * 1. Groups images by orientation (horizontal/vertical/square)
 * 2. Distributes images across rows to minimize gaps
 * 3. Applies different span sizes based on orientation and priority
 * 4. Ensures responsive behavior across all screen sizes
 */

const PhotoMosaic = ({ images = [] }) => {
  const galleryRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [erroredImages, setErroredImages] = useState(new Set());
  // We avoid driving layout from image load measurements to prevent
  // constant reflow as images load. Layout uses the provided
  // `orientation` in the data (recommended). If not provided we
  // fallback to 'horizontal' to keep the layout stable.
  const [imageDimensions, setImageDimensions] = useState({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const cards = galleryRef.current?.querySelectorAll('[data-mosaic-card]');
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-card');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.1 }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images.length, loadedImages.size]);

  const handleImageLoad = useCallback((index, event) => {
    // Track loaded state for fade-in but avoid using these
    // measurements to change layout. This keeps positions stable
    // while images progressively load.
    const { naturalWidth, naturalHeight } = event.target;
    setImageDimensions(prev => ({
      ...prev,
      [index]: { width: naturalWidth, height: naturalHeight }
    }));
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  const handleImageError = useCallback((index) => {
    setErroredImages(prev => new Set(prev).add(index));
  }, []);

  /**
   * Intelligent layout algorithm:
   * - Arranges images in rows based on their orientation
   * - Horizontal images span 2 columns, vertical/square span 1
   * - High priority items may get larger spans
   * - Creates a balanced, visually appealing grid
   */
  const layoutGrid = useMemo(() => {
    if (!images.length) return [];

    // Enhance images with layout metadata. Use the provided
    // `orientation` when available; fall back to 'horizontal'.
    // We intentionally do NOT auto-detect orientation from
    // measurements for layout decisions, because that causes
    // items to shift as images load and creates the "glitching"
    // behaviour you observed.
    const enhanced = images.map((img, index) => ({
      ...img,
      index,
      orientation: img.orientation || 'horizontal',
      priority: img.priority || 1,
    }));

    // Stable sort by priority (higher first), preserve original
    // order for equal priorities to avoid unnecessary reshuffling.
    const sorted = [...enhanced].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.index - b.index;
    });

    // Simple packing into rows that map naturally to CSS Grid
    const COLS_DESKTOP = 4;
    const rows = [];
    let currentRow = [];
    let currentUnits = 0;

    sorted.forEach((img) => {
      let colSpan = img.orientation === 'horizontal' ? 2 : 1;
      // give very high priority items a little extra emphasis
      if (img.priority >= 3) colSpan = Math.max(colSpan, 2);

      const rowSpan = img.orientation === 'vertical' && img.priority >= 2 ? 2 : 1;

      const item = { ...img, colSpan, rowSpan };

      if (currentUnits + colSpan <= COLS_DESKTOP) {
        currentRow.push(item);
        currentUnits += colSpan;
      } else {
        if (currentRow.length) rows.push(currentRow);
        currentRow = [item];
        currentUnits = colSpan;
      }
    });

    if (currentRow.length) rows.push(currentRow);

    // Flatten rows to a single list for rendering. The packing
    // algorithm ensures elements fit into rows without needing
    // further layout updates when images load.
    return rows.flat();
  }, [images]);

  if (!images.length) {
    return null;
  }

  return (
    <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-24">
      <div className="mx-auto max-w-screen-2xl">
        <div
          ref={galleryRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[260px]"
        >
          {layoutGrid.map((item, i) => {
            const isLoaded = loadedImages.has(item.index);
            const isError = erroredImages.has(item.index);

            // Dynamic grid span classes
            const colSpanClass = item.colSpan === 2 
              ? 'col-span-2' 
              : 'col-span-1';
            const rowSpanClass = item.rowSpan === 2 
              ? 'row-span-2' 
              : 'row-span-1';

            return (
              <figure
                key={item.index}
                data-mosaic-card
                className={`
                  relative overflow-hidden rounded-[20px]
                  ${colSpanClass} ${rowSpanClass}
                  opacity-0 
                  group cursor-pointer
                  transition-all duration-300 ease-out
                  hover:scale-[1.02] hover:z-10
                  ring-1 ring-white/10 hover:ring-white/20
                `}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {!isError ? (
                  <>
                    {/* Loading skeleton */}
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 animate-pulse" />
                    )}

                    {/* Image */}
                    <img
                      src={item.src}
                      alt={item.alt || `Gallery image ${item.index + 1}`}
                      loading="lazy"
                      decoding="async"
                      onLoad={(e) => handleImageLoad(item.index, e)}
                      onError={() => handleImageError(item.index)}
                      className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-all duration-500
                        ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                        group-hover:scale-105
                      `}
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    />

                    {/* Hover overlay with caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {item.caption && (
                      <figcaption className="
                        absolute bottom-0 left-0 right-0 p-4
                        transform translate-y-full group-hover:translate-y-0
                        transition-transform duration-300 ease-out
                      ">
                        <p className="text-white text-sm sm:text-base font-adamant font-medium">
                          {item.caption}
                        </p>
                      </figcaption>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/60">
                    <p className="text-sm text-neutral-400">Image unavailable</p>
                  </div>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

PhotoMosaic.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      caption: PropTypes.string,
      orientation: PropTypes.oneOf(['horizontal', 'vertical', 'square']),
      priority: PropTypes.number,
    })
  ),
};

export default React.memo(PhotoMosaic);

import React, { useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const PhotoMosaic = ({ images = [] }) => {
  const galleryRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const cards = galleryRef.current?.querySelectorAll("[data-mosaic-card]");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-card");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.1 },
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images.length]);

  const layoutGrid = useMemo(() => {
    if (!images.length) return [];

    const enhanced = images.map((img, index) => ({
      ...img,
      index,
      orientation: img.orientation || "horizontal",
      priority: img.priority || 1,
    }));

    const sorted = [...enhanced].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.index - b.index;
    });

    const COLS_DESKTOP = 4;
    const rows = [];
    let currentRow = [];
    let currentUnits = 0;

    sorted.forEach((img) => {
      let colSpan = img.orientation === "horizontal" ? 2 : 1;
      // give very high priority items a little extra emphasis
      if (img.priority >= 3) colSpan = Math.max(colSpan, 2);

      const rowSpan =
        img.orientation === "vertical" && img.priority >= 2 ? 2 : 1;

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
            // Dynamic grid span classes
            const colSpanClass =
              item.colSpan === 2 ? "col-span-2" : "col-span-1";
            const rowSpanClass =
              item.rowSpan === 2 ? "row-span-2" : "row-span-1";

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
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 animate-pulse" />

                <img
                  src={item.src}
                  alt={item.alt || `Gallery image ${item.index + 1}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    e.target.classList.remove("mosaic-image-loading");
                  }}
                  className="
                    mosaic-image-loading
                    absolute inset-0 w-full h-full object-cover
                    transition-all duration-700 ease-out
                    group-hover:scale-105
                  "
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                />

                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {item.caption && (
                  <figcaption
                    className="
                    absolute bottom-0 left-0 right-0 p-4
                    transform translate-y-full group-hover:translate-y-0
                    transition-transform duration-300 ease-out
                  "
                  >
                    <p className="text-white text-sm sm:text-base font-adamant font-medium">
                      {item.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>

      <style>{`
        .mosaic-image-loading {
          opacity: 0;
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

PhotoMosaic.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      caption: PropTypes.string,
      orientation: PropTypes.oneOf(["horizontal", "vertical", "square"]),
      priority: PropTypes.number,
    }),
  ),
};

export default React.memo(PhotoMosaic);

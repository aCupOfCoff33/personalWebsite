import React, { useRef, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const PhotoMosaic = ({ images = [] }) => {
  const galleryRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

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
      let colSpan =
        img.orientation === "horizontal" && img.priority >= 2 ? 2 : 1;

      const aspectClass =
        img.orientation === "vertical"
          ? "aspect-[3/4]"
          : img.orientation === "square"
            ? "aspect-[1/1]"
            : "aspect-[4/3]";

      const item = { ...img, colSpan, aspectClass };

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

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  if (!images.length) {
    return null;
  }

  return (
    <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-24">
      <div className="mx-auto max-w-screen-2xl">
        <div
          ref={galleryRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 grid-flow-row-dense"
        >
          {layoutGrid.map((item, i) => {
            const colSpanClass =
              item.colSpan === 2 ? "col-span-2" : "col-span-1";
            const isLoaded = loadedImages.has(item.index);

            return (
              <figure
                key={item.index}
                data-mosaic-card
                className={`
                  relative overflow-hidden rounded-[20px]
                  ${colSpanClass} ${item.aspectClass}
                  opacity-0
                  group cursor-pointer
                  ring-1 ring-white/10
                `}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Optimized placeholder - static background, no animation */}
                <div
                  className={`absolute inset-0 bg-neutral-800/50 transition-opacity duration-500 ${
                    isLoaded ? "opacity-0" : "opacity-100"
                  }`}
                />

                <img
                  src={item.src}
                  alt={item.alt || `Gallery image ${item.index + 1}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(item.index)}
                  className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-opacity duration-700 ease-out
                    ${isLoaded ? "opacity-100" : "opacity-0"}
                  `}
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                />

                {/* Optimized hover overlay - only transforms on hover */}
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

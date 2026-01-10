import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * PhotoMosaic - Intelligent image gallery with adaptive grid layout
 * Uses actual image dimensions to create a packed mosaic with minimal black space
 */
const PhotoMosaic = ({ images = [] }) => {
  const galleryRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageDimensions, setImageDimensions] = useState({});

  // Load actual image dimensions
  useEffect(() => {
    const loadImageDimensions = async () => {
      const dims = {};
      const promises = images.map((img, index) => {
        return new Promise((resolve) => {
          const imgElement = new Image();
          imgElement.onload = () => {
            const aspectRatio = imgElement.width / imgElement.height;
            dims[index] = {
              width: imgElement.width,
              height: imgElement.height,
              aspectRatio,
            };
            resolve();
          };
          imgElement.onerror = () => {
            // Default to orientation if load fails
            const aspect =
              img.orientation === "vertical"
                ? 0.75
                : img.orientation === "square"
                  ? 1
                  : 1.5;
            dims[index] = { aspectRatio: aspect };
            resolve();
          };
          imgElement.src = img.src;
        });
      });

      await Promise.all(promises);
      setImageDimensions(dims);
    };

    if (images.length > 0) {
      loadImageDimensions();
    }
  }, [images]);

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
  }, [images.length, imageDimensions]);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  if (!images.length) {
    return null;
  }

  // Intelligent layout algorithm
  const getLayoutClasses = (index) => {
    const dims = imageDimensions[index];
    if (!dims) return { colSpan: "col-span-1", rowSpan: "row-span-1" };

    const aspect = dims.aspectRatio;

    // Categorize images by aspect ratio for better packing
    let colSpan, rowSpan;

    if (aspect > 2.0) {
      // Ultra-wide (2.17:1) - take 3-4 columns full width, shorter height to fit naturally
      colSpan = "col-span-2 sm:col-span-3 lg:col-span-4";
      rowSpan = "row-span-1";
    } else if (aspect > 1.4) {
      // Wide panoramic (1.78:1, 1.56:1, 1.51:1) - take 2-3 columns, taller to show full photo
      colSpan = "col-span-2 sm:col-span-3 lg:col-span-3";
      rowSpan = "row-span-2";
    } else if (aspect > 1.1) {
      // Moderate horizontal (1.33:1) - take 1 column, 1 row
      colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
      rowSpan = "row-span-1";
    } else if (aspect > 0.9) {
      // Square-ish (1:1) - take 1 column, 1 row
      colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
      rowSpan = "row-span-1";
    } else {
      // Vertical (0.75:1) - take 1 column, can span more rows
      colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
      rowSpan = "row-span-2 sm:row-span-2 lg:row-span-2";
    }

    return { colSpan, rowSpan };
  };

  // Get aspect ratio class for proper image sizing
  const getAspectClass = (index) => {
    const dims = imageDimensions[index];
    if (!dims) return "aspect-[4/3]";

    const aspect = dims.aspectRatio;

    if (aspect > 2.0) {
      return "aspect-[2.2/1]";
    } else if (aspect > 1.7) {
      return "aspect-[16/9]";
    } else if (aspect > 1.4) {
      return "aspect-[3/2]";
    } else if (aspect > 1.1) {
      return "aspect-[4/3]";
    } else if (aspect > 0.9) {
      return "aspect-[1/1]";
    } else {
      return "aspect-[3/4]";
    }
  };

  return (
    <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-24">
      <div className="mx-auto max-w-screen-2xl">
        <div
          ref={galleryRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] lg:auto-rows-[220px] gap-3 sm:gap-4 lg:gap-5"
          style={{ gridAutoFlow: "dense" }}
        >
          {images.map((item, index) => {
            const { colSpan, rowSpan } = getLayoutClasses(index);
            const aspectClass = getAspectClass(index);
            const isLoaded = loadedImages.has(index);

            return (
              <figure
                key={index}
                data-mosaic-card
                className={`
                  relative overflow-hidden rounded-[20px]
                  ${colSpan} ${rowSpan}
                  ${
                    imageDimensions[index]?.aspectRatio > 1.4
                      ? "bg-neutral-900/40"
                      : ""
                  }
                  opacity-0
                  group cursor-pointer
                  ring-1 ring-white/10
                  transition-all duration-300
                  hover:ring-white/20 hover:shadow-xl
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Optimized placeholder - static background, no animation */}
                <div
                  className={`absolute inset-0 bg-neutral-800/50 transition-opacity duration-500 ${
                    isLoaded ? "opacity-0" : "opacity-100"
                  }`}
                />

                <img
                  src={item.src}
                  alt={item.alt || `Gallery image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(index)}
                  className={`
                    absolute inset-0 w-full h-full
                    ${
                      imageDimensions[index]?.aspectRatio > 1.4
                        ? "object-contain"
                        : "object-cover"
                    }
                    transition-opacity duration-700 ease-out
                    ${isLoaded ? "opacity-100" : "opacity-0"}
                  `}
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                />

                {/* Optimized hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {item.caption && (
                  <figcaption
                    className="
                    absolute bottom-0 left-0 right-0 p-3 sm:p-4
                    transform translate-y-full group-hover:translate-y-0
                    transition-transform duration-300 ease-out
                  "
                  >
                    <p className="text-white text-xs sm:text-sm lg:text-base font-adamant font-medium leading-tight">
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

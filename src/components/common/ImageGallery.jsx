import React, { useRef, useEffect, useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const galleryRef = useRef(null);
  const [loaded, setLoaded] = useState(new Set());
  const [errored, setErrored] = useState(new Set());

  useEffect(() => {
    const cards = galleryRef.current?.querySelectorAll('[data-card]');
    if (!cards?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('animate-card'); // keep your existing animation
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [images.length]);

  const onLoad = (i) => setLoaded((s) => new Set(s).add(i));
  const onError = (i) => setErrored((s) => new Set(s).add(i));

  // Use URLs without forced ?w/h&fit so the browser keeps real aspect ratios
  const defaults = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', alt: 'Mountain landscape' },
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', alt: 'Forest view' },
    { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', alt: 'Sunset scene' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', alt: 'Nature path' },
    { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', alt: 'Woodland' },
    { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', alt: 'Valley vista' },
    { src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', alt: 'Lake view' },
    { src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6', alt: 'Mountain peak' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', alt: 'Ocean sunset' },
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', alt: 'Forest path' },
  ];

  const gallery = images.length ? images : defaults;

  return (
    <div ref={galleryRef} className="w-full px-6 sm:px-12 lg:px-12 py-12 sm:py-16">
      <div className="mx-auto max-w-screen-2xl lg:max-w-[1068px]">
        {/* Masonry via CSS columns. 4 cols on lg+ to make images smaller. */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 [column-fill:balance]">
          {gallery.map((img, i) => {
            const isLoaded = loaded.has(i);
            const isError = errored.has(i);

            return (
              <figure
                key={i}
                data-card
                className="
                  relative mb-6 break-inside-avoid rounded-2xl overflow-hidden
                  opacity-0 shadow-sm shadow-black/10
                "
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {!isError ? (
                  <>
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 animate-pulse" />
                    )}

                    <img
                      src={img.src}
                      alt={img.alt || `Gallery image ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => onLoad(i)}
                      onError={() => onError(i)}
                      className={`block w-full h-auto transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />

                    {img.caption && isLoaded && (
                      <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className="text-sm text-white/90">{img.caption}</p>
                      </figcaption>
                    )}
                  </>
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center bg-neutral-900/60 border border-white/10">
                    <p className="text-sm text-neutral-400">Image unavailable</p>
                  </div>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImageGallery);

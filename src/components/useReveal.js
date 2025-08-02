import { useEffect, useRef } from 'react';

export function useReveal(stagger = 0.09) {
  const rootRef = useRef(null);

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('[data-reveal]');
    if (!els?.length) return;

    const io = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        els.forEach((el, i) =>
          setTimeout(() => el.classList.add('animate-card'), i * stagger * 1e3)
        );
        io.disconnect();
      },
      { rootMargin: '0px 0px -15% 0px' }
    );

    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [stagger]);

  return rootRef;
}

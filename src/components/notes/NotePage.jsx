import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import NoteSection from './NoteSection';
import { getNoteBySlug } from './mockNotesData';
import { useNotesTOC } from './NotesContext';
import { motion } from 'framer-motion';

// Presents a single note page at route /notes/:slug
export default function NotePage() {
  const { slug } = useParams();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { setTocItems, setTocVisible, setContactCollapsed, setReadingProgress } = useNotesTOC();
  const sentinelRef = React.useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getNoteBySlug(slug).then((data) => {
      if (!mounted) return;
      setNote(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
      setTocItems([]); // cleanup TOC
      setTocVisible(false);
      setContactCollapsed(false);
    };
  }, [slug, setTocItems, setTocVisible, setContactCollapsed]);

  // Memoize TOC items generation
  const tocItems = useMemo(() => {
    if (!note) return [];
    return note.sections
      .filter((s) => s.type === 'heading')
      .map((s) => ({ id: s.id, text: s.text, level: s.level || 2 }));
  }, [note]);

  // Publish TOC into context for sidebar usage
  useEffect(() => {
    setTocItems(tocItems);
  }, [tocItems, setTocItems]);

  // Use an IntersectionObserver on heading elements to drive discrete section changes
  // This updates readingProgress to index/tocItems.length when a major heading becomes active.
  React.useEffect(() => {
    if (!tocItems || tocItems.length === 0) return undefined;

    // Slightly above-center sentinel to consider a heading "active" when it reaches near the top of the viewport
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0.01,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const idx = tocItems.findIndex((t) => t.id === id);
        if (idx >= 0) {
          // Map discrete index to a readingProgress in [0, 1)
          setReadingProgress(idx / tocItems.length);
        }
      });
    }, observerOptions);

    // Observe the actual heading elements by id
    const observedEls = [];
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        observedEls.push(el);
      }
    });

    return () => {
      observer.disconnect();
      // no need to individually unobserve; disconnect handles it
    };
  }, [tocItems, setReadingProgress]);

  // Do not compute published label until after we know `note` is loaded

  // Scroll-driven sentinel with hysteresis to avoid flicker and keep state stable while reading.
  React.useEffect(() => {
    const readingRef = { current: false };
    let sentinelTop = 0;

    const updateSentinelPos = () => {
      const el = sentinelRef.current;
      if (!el) return;
      sentinelTop = el.getBoundingClientRect().top + window.scrollY;
    };

    const computeAndSet = () => {
      if (!sentinelTop) updateSentinelPos();
      const scrollY = window.scrollY;

      // Hysteresis: enter reading slightly below sentinel; exit only after moving well above it
      const enterY = sentinelTop - 32; // collapse once we pass near sentinel
      const exitY = sentinelTop - 96;  // expand only when back near the very top

      const current = readingRef.current;
      let next = current;
      if (!current && scrollY >= enterY) next = true;
      else if (current && scrollY <= exitY) next = false;

      if (next !== current) {
        readingRef.current = next;
        setTocVisible(next);
        setContactCollapsed(next);
      }

      // Compute progress from 0 (top) to 1 (just after sentinel hits top)
      const range = Math.max(1, enterY - exitY); // avoid divide by zero
      const progress = Math.min(1, Math.max(0, (scrollY - exitY) / range));
      // Only use the continuous sentinel-based progress when there are no TOC headings to observe.
      if (!tocItems || tocItems.length === 0) {
        setReadingProgress(progress);
      }
    };

    // Initial compute and on events
    updateSentinelPos();
    computeAndSet();
    const onScroll = () => {
      // Use rAF to coalesce multiple scroll events
      if (onScroll._raf) return;
      onScroll._raf = requestAnimationFrame(() => {
        onScroll._raf = null;
        computeAndSet();
      });
    };
    const onResize = () => {
      updateSentinelPos();
      computeAndSet();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (onScroll._raf) cancelAnimationFrame(onScroll._raf);
    };
  }, [note, tocItems, setTocVisible, setContactCollapsed, setReadingProgress]);

  // Early returns must come after all hooks are declared to preserve hook order
  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-20 text-white">
        <p className="animate-pulse text-neutral-400">Loading…</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-20 text-white">
        <p className="text-lg">Note not found.</p>
        <Link to="/" className="text-blue-400 underline">Go home</Link>
      </div>
    );
  }

  // Compute published label safely now that `note` is defined
  const publishedDate = new Date(note.date);
  const publishedLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(publishedDate);
  const MotionH1 = motion.h1;

  return (
    <article className="mx-auto w-full text-white">
      {/* Top heading — aligned to match hero spacing: push down considerably */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-12">
          <MotionH1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-semibold italic text-white font-adamant"
          >
            {note.title}
          </MotionH1>
          <p className="mt-3 text-neutral-400 font-adamant text-lg">Published: {publishedLabel}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large thumbnail */}
        <div className="w-full">
          <div className="w-full aspect-video overflow-hidden rounded-2xl border border-white/10">
            <img src={note.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Sentinel: right before content starts to drive reading state */}
        <div ref={sentinelRef} aria-hidden="true" />

        {/* Content — add large spacer so Introduction is below the fold initially */}
        <div className="mt-28 flex flex-col gap-8 pb-24">
          {note.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <NoteSection section={section} />
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

NotePage.propTypes = {
  // no props; uses router and context
};



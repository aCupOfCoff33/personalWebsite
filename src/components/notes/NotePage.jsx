import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import NoteSection from "./NoteSection";
import { getNoteBySlug } from "./mockNotesData";
import { useNotesTOCActions } from "./NotesHooks";
import { motion } from "framer-motion";

// Presents a single note page at route /notes/:slug
export default function NotePage() {
  const { slug } = useParams();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const {
    setTocItems,
    setTocVisible,
    setContactCollapsed,
    setReadingProgress,
  } = useNotesTOCActions();
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
      .filter((s) => s.type === "heading")
      .map((s) => ({ id: s.id, text: s.text, level: s.level || 2 }));
  }, [note]);

  // Publish TOC into context for sidebar usage
  useEffect(() => {
    setTocItems(tocItems);
  }, [tocItems, setTocItems]);

  // Do not compute published label until after we know `note` is loaded

  // IntersectionObserver + scroll sentinel in one effect to avoid racey teardown/setup.
  React.useEffect(() => {
    if (!note) return undefined;

    const readingRef = { current: false };
    const tocIndexById = new Map(
      (tocItems || []).map((item, index) => [item.id, index]),
    );
    const hasToc = tocIndexById.size > 0;
    let sentinelTop = 0;
    let observer;

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
      const exitY = sentinelTop - 96; // expand only when back near the very top

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
      if (!hasToc) {
        setReadingProgress(progress);
      }
    };

    if (hasToc) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const idx = tocIndexById.get(entry.target.id);
            if (idx !== undefined) {
              setReadingProgress(idx / tocIndexById.size);
            }
          });
        },
        {
          root: null,
          rootMargin: "-30% 0px -70% 0px",
          threshold: 0.01,
        },
      );

      tocItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }

    updateSentinelPos();
    computeAndSet();

    const onScroll = () => {
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (onScroll._raf) cancelAnimationFrame(onScroll._raf);
      if (observer) observer.disconnect();
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
        <Link to="/" className="text-blue-400 underline">
          Go home
        </Link>
      </div>
    );
  }

  // Compute published label safely now that `note` is defined
  const publishedDate = new Date(note.date);
  const publishedLabel = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(publishedDate);
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
          <p className="mt-3 text-neutral-400 font-adamant text-lg">
            Published: {publishedLabel}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large thumbnail */}
        <div className="w-full">
          <div className="w-full aspect-video overflow-hidden rounded-2xl border border-white/10">
            <img
              src={note.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
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

/* HeroTypingAnimation.jsx */
import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";


/* ── constants ─────────────────────────────────────────────── */
const HEADLINE = "Hey there! I’m Aaryan!";
const BORDER = 4; // 4-px outline from Figma
const CORNER_SIZE = 12; // 12-px blue squares (w-3 / h-3)

export default function HeroTypingAnimation() {
  /* animation state */
  const bodyRef = useRef(null);
  const [typed, setTyped] = useState("");
  const [showCursor, setCursor] = useState(false);
  const [showFrame, setFrame] = useState(false);
  const [showBody, setBody] = useState(false);
  const [dragOK, setDragOK] = useState(false);

  /* motion values for drag / snap */
  const x = useMotionValue(-120);
  const y = useMotionValue(0);
  const frameRef = useRef(null);
  const [centreX, setCentreX] = useState(0);

  /* ── orchestrate the sequence ───────────────────────────── */
  useEffect(() => {
    (async () => {
      /* 1 ▸ reveal the frame */
      await new Promise((r) => setTimeout(r, 100));
      setFrame(true);

      /* 2 ▸ type the headline */
      setCursor(true);
      for (let i = 0; i <= HEADLINE.length; i++) {
        setTyped(HEADLINE.slice(0, i));
        await new Promise((r) => setTimeout(r, 65));
      }
      setTimeout(() => setCursor(false), 900);

      /* 3 ▸ fade-in body copy */
      await new Promise((r) => setTimeout(r, 300));
      setBody(true);

      /* 4 ▸ centre the frame, then enable drag */
      await new Promise((r) => setTimeout(r, 400));
      const frameLeft = frameRef.current.getBoundingClientRect().left;
      const bodyLeft = bodyRef.current.getBoundingClientRect().left;
      const delta = bodyLeft - frameLeft;
      const finalX = x.get() + delta;
      setCentreX(finalX);
      await animate(x, finalX, { type: "spring", stiffness: 55, damping: 18 });
      setDragOK(true);
    })();
  }, []);

  /* snap the frame back after dragging */
  const snapBack = () =>
    setTimeout(() => {
      animate(x, centreX, { type: "spring", stiffness: 65, damping: 18 });
      animate(y, 0, { type: "spring", stiffness: 65, damping: 18 });
    }, 800);

  /* ── render ─────────────────────────────────────────────── */
  return (
    <section className="relative w-full max-w-screen-xl mx-auto px-6 pt-32 text-white font-adamant">
      {/* ── headline & draggable blue frame ── */}
      <motion.div
        ref={frameRef}
        drag={dragOK}
        dragMomentum={false}
        onDragEnd={snapBack}
        style={{ x, y }}
        className={`relative inline-block px-10 py-6 ${
          dragOK ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      >
        {showFrame && (
          <>
            {/* outline */}
            <motion.div
              className="absolute inset-0"
              style={{ border: `${BORDER}px solid #198ce7` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />

            {/* 8 little squares (size = CORNER_SIZE) */}
            {[
              "-top-[4px] -left-[4px]",
              "-top-[4px] left-1/2 -translate-x-1/2",
              "-top-[4px] -right-[4px]",
              "top-1/2 -left-[4px] -translate-y-1/2",
              "top-1/2 -right-[4px] -translate-y-1/2",
              "-bottom-[4px] -left-[4px]",
              "-bottom-[4px] left-1/2 -translate-x-1/2",
              "-bottom-[4px] -right-[4px]",
            ].map((pos, i) => (
              <div key={i} className={`absolute w-3 h-3 bg-[#198ce7] ${pos}`} />
            ))}
          </>
        )}

        <h1 className="whitespace-nowrap text-5xl md:text-6xl font-bold leading-none">
          {typed}
          {showCursor && <span className="animate-pulse">|</span>}
        </h1>
      </motion.div>

      {/* ── body: tagline + meta grid ── */}
      <motion.div
        ref={bodyRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBody ? 1 : 0 }}
        transition={{ duration: 0.55 }}
        className="mt-12 space-y-12 max-w-[72rem]"
      >
        {/* tagline */}
        <p className="text-2xl md:text-3xl leading-relaxed">
          A Software Engineering&nbsp;&amp;&nbsp;Business student at Western U
          based near Toronto, building tools that <em>(ideally)</em> make life
          easier — or at least break things in more interesting ways.
        </p>

        {/* “currently / driven by” grid */}
        <div className="grid gap-y-10 gap-x-24 sm:grid-cols-2 text-xl">
          <div>
            <p className="italic text-2xl mb-2">currently</p>
            <p className="text-[#9b9cbe] font-semibold leading-snug">
              data analytics &amp; strategy intern @ american global
            </p>
          </div>
          <div>
            <p className="italic text-2xl mb-2">driven by</p>
            <p className="text-[#9b9cbe] font-semibold leading-snug">
              curiosity, creative problem-solving &amp; an arguably unhealthy
              obsession with bears.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

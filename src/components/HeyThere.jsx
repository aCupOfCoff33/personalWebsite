import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const HeroTypingAnimation = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);

  const name = "Hey there! I’m Aaryan!";
  const x = useMotionValue(-80); // Starting position off-screen
  const y = useMotionValue(0);

  useEffect(() => {
    const sequence = async () => {
      // 1. Cursor appears
      await new Promise((r) => setTimeout(r, 300));
      setShowCursor(true);

      // 2. Blue outline appears
      await new Promise((r) => setTimeout(r, 400));
      setShowOutline(true);

      // 3. Type out name
      for (let i = 0; i <= name.length; i++) {
        setText(name.slice(0, i));
        await new Promise((r) => setTimeout(r, 80));
      }

      // 4. Hide cursor after typing
      setTimeout(() => setShowCursor(false), 1000);

      // 5. Show paragraph
      await new Promise((r) => setTimeout(r, 500));
      setShowParagraph(true);

      // 6. Slide name into final position
      await new Promise((r) => setTimeout(r, 1000));
      await animate(x, 0, {
        type: "spring",
        stiffness: 50,
        damping: 20,
      });
      setHasMoved(true);
      setDragEnabled(true);
    };

    sequence();
  }, []);

  const handleDragEnd = () => {
    setTimeout(() => {
      animate(x, 0, {
        type: "spring",
        stiffness: 60,
        damping: 20,
      });
      animate(y, 0, {
        type: "spring",
        stiffness: 60,
        damping: 20,
      });
    }, 1000);
  };

  return (
    <div className="text-white min-h-screen pt-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`relative w-fit h-fit ${
            dragEnabled
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-default"
          }`}
          style={{ x, y }}
          drag={dragEnabled}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          <div className="relative px-6 py-3 text-5xl font-bold">
            {text}
            {showCursor && <span className="animate-pulse">|</span>}
            {showOutline && (
              <>
                <motion.div
                  className="absolute inset-0 border-4 border-[#198ce7]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                {[
                  ["top-[-4px]", "left-[-4px]"],
                  ["top-[-4px]", "right-[-4px]"],
                  ["bottom-[-4px]", "left-[-4px]"],
                  ["bottom-[-4px]", "right-[-4px]"],
                ].map(([top, left], i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 bg-[#198ce7] ${top} ${left} rounded-sm`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>

        {showParagraph && (
          <motion.div
            className="mt-10 max-w-[64rem] text-2xl font-bold text-white space-y-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              Studying <u>Software Engineering</u> and <u>Business</u> at
              Western University to better serve people in fun and innovative
              ways!
            </p>
            <p>
              In other words, I move rectangles around and crash Excel sheets
              repeatedly.
            </p>
            <p>Also might have an unhealthy obsession with bears…</p>
            <p>
              Previously at{" "}
              <a
                href="https://americanglobal.com"
                className="underline hover:text-brand-blue transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                American Global
              </a>{" "}
              and{" "}
              <a
                href="https://www.canada.ca/en/employment-social-development.html"
                className="underline hover:text-brand-blue transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                ESDC
              </a>
              .
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroTypingAnimation;

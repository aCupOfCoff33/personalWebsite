import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const HeroFigmaStyled = () => {
  const [showOutline, setShowOutline] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowOutline(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleDragEnd = () => {
    setTimeout(() => {
      animate(x, 0, {
        type: "spring",
        stiffness: 80,
        damping: 20,
        restDelta: 0.5,
      });
      animate(y, 0, {
        type: "spring",
        stiffness: 80,
        damping: 20,
        restDelta: 0.5,
      });
    }, 1000);
  };

  return (
    <div className=" text-white min-h-screen pt-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`relative w-fit h-fit ${
            showOutline
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-default"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ x, y, userSelect: "none" }}
          drag={showOutline}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          <div className="relative px-6 py-3 text-5xl font-bold">
            Hey there! I’m Aaryan!
            {/* Blue outline and corner dots */}
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
                ].map(([top, left], index) => (
                  <motion.div
                    key={index}
                    className={`absolute w-2 h-2 bg-[#198ce7] ${top} ${left} rounded-sm`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>

        <motion.div
  className="mt-10 max-w-[827px] text-2xl font-bold text-white space-y-6 leading-relaxed"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 1.2 }}
>
  <p>
    Studying Software Engineering and Business at Western University to better serve people in fun and innovative ways!
  </p>
  <p>
    In other words, I move rectangles around and crash Excel sheets repeatedly.
  </p>
  <p>
    Also might have an unhealthy obsession with bears…
  </p>
  <p>
    Previously at{' '}
    <a
      href="https://americanglobal.com" // Replace with correct link if needed
      className="underline hover:text-brand-blue transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      American Global
    </a>{' '}
    and{' '}
    <a
      href="https://www.canada.ca/en/employment-social-development.html" // ESDC link
      className="underline hover:text-brand-blue transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      ESDC
    </a>.
  </p>
</motion.div>

      </div>
    </div>
  );
};

export default HeroFigmaStyled;

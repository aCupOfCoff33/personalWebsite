// Unified Bear Icon orchestrator: single SVG with BaseBear and conditional accessories
import React, { useId } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useBearState } from './useBearState';
import BaseBear from './bear/BaseBear';
import Laptop from './bear/Laptop';
import Book from './bear/Book';
import Suit from './bear/Suit';

const UnifiedBearIcon = React.memo(function UnifiedBearIcon({ className = '' }) {
  const { bearState } = useBearState();
  const uid = useId();

  const computeItems = () => {
    const items = [];
    const { currentType, pendingType, previousType, itemPosition } = bearState || {};

    const typeToComp = (type) => {
      switch (type) {
        case 'projects':
          return Laptop;
        case 'stories':
          return Book;
        case 'resume':
          return Suit;
        default:
          return null;
      }
    };

    const pushIf = (type, pos, key) => {
      const Comp = typeToComp(type);
      if (!Comp) return;
      items.push({ key, Comp, pos, type });
    };

    // Outgoing item during slide-down
    if (previousType && itemPosition === 'transitioning-down') {
      pushIf(previousType, 'transitioning-down', `out-${previousType}`);
    }

    // Incoming or steady-state
    if (pendingType) {
      if (itemPosition === 'transitioning-up') pushIf(pendingType, 'transitioning-up', `in-${pendingType}`);
      if (itemPosition === 'visible') pushIf(pendingType, 'visible', `cur-${pendingType}`);
    } else if (currentType && currentType !== 'default') {
      pushIf(currentType, itemPosition || 'visible', `cur-${currentType}`);
    }

    return items;
  };

  const items = computeItems();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" className={className} role="img" aria-hidden="true">
      <BaseBear />
      <AnimatePresence initial={false} mode="sync">
    {items.map((item) => (
          <Motion.g key={item.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <item.Comp position={item.pos} idSuffix={`-${uid}-${item.type}`} />
          </Motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
});

UnifiedBearIcon.displayName = 'UnifiedBearIcon';
export default UnifiedBearIcon;

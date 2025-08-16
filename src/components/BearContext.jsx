import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Create context in separate file to avoid fast refresh issues
const BearContext = createContext();

const ANIM = {
  DURATION: 420, // ms for transform/opacity animation
  HALF: 210,
  ENTRY_DELAY: 120, // increase to allow layout/paint before animating in
};

const BearProvider = ({ children }) => {
  const location = useLocation();

  const detectType = (path) => {
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/notes')) return 'stories';
    if (path.startsWith('/resume')) return 'resume';
    return 'default';
  };

  const getInitialState = () => {
    const t = detectType(location.pathname);

    // If the app loads on a non-default route, start with default as current and
    // make the real route a pendingType so it can animate in (hidden -> transitioning-up -> visible).
    if (t === 'default') {
      return {
        currentType: 'default',
        pendingType: null,
        isTransitioning: false,
        itemPosition: 'visible',
      };
    }

    return {
      currentType: 'default', // remain default so we can animate the incoming item
      pendingType: t,
      isTransitioning: true,
      itemPosition: 'hidden', // incoming starts hidden and will transition-up
    };
  };

  const [bearState, setBearState] = useState(getInitialState());

  // If the app boots with a pendingType (non-default initial route), animate it up
  React.useEffect(() => {
    // Only run once after mount
    if (bearState.pendingType && bearState.itemPosition === 'hidden') {
      // small delay to ensure DOM painted
      setTimeout(() => {
        setBearState(cur => ({ ...cur, itemPosition: 'transitioning-up' }));
      }, ANIM.ENTRY_DELAY);

      setTimeout(() => {
        setBearState(cur => ({
          ...cur,
          currentType: cur.pendingType,
          pendingType: null,
          itemPosition: 'visible',
          isTransitioning: false,
        }));
      }, ANIM.ENTRY_DELAY + ANIM.DURATION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newType = detectType(location.pathname);

    setBearState((prev) => {
      if (newType === prev.currentType) return prev;

      // Start a transition. We'll keep currentType as the currently visible item
      // and set pendingType to the target so both can be rendered during animation.
      const startState = {
        ...prev,
        pendingType: newType,
        isTransitioning: true,
      };

      // Case: navigating to home (from something -> default)
      if (newType === 'default') {
        // slide current item down
        startState.itemPosition = 'transitioning-down';

        setTimeout(() => {
          // After animation, make default the current
          setBearState((cur) => ({
            ...cur,
            currentType: 'default',
            pendingType: null,
            itemPosition: 'visible',
            isTransitioning: false,
          }));
        }, ANIM.DURATION + 20);

        return startState;
      }

      // Case: coming from home -> entering projects/stories
      if (prev.currentType === 'default') {
        // small delay to mount incoming element, then animate it up
        startState.itemPosition = 'hidden';

        setTimeout(() => {
          setBearState((cur) => ({ ...cur, itemPosition: 'transitioning-up' }));
        }, ANIM.ENTRY_DELAY);

        setTimeout(() => {
          setBearState((cur) => ({
            ...cur,
            currentType: newType,
            pendingType: null,
            itemPosition: 'visible',
            isTransitioning: false,
          }));
        }, ANIM.ENTRY_DELAY + ANIM.DURATION);

        return startState;
      }

      // Case: switching between two non-defaults (projects <-> stories)
      // Slide current down, then slide incoming up
      startState.itemPosition = 'transitioning-down';

      setTimeout(() => {
        setBearState((cur) => ({ ...cur, itemPosition: 'transitioning-up' }));
      }, ANIM.HALF + 40);

      setTimeout(() => {
        setBearState((cur) => ({
          ...cur,
          currentType: newType,
          pendingType: null,
          itemPosition: 'visible',
          isTransitioning: false,
        }));
      }, ANIM.DURATION + 100);

      return startState;
    });
  }, [location.pathname]);

  return (
    <BearContext.Provider value={{ bearState, setBearState }}>
      {children}
    </BearContext.Provider>
  );
};

export { BearContext };
export default BearProvider;

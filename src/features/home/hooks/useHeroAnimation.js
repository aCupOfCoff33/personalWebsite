import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { animate } from "framer-motion";

const initialState = {
  frameAligned: false,
  showCursor: false,
  showFrame: false,
  phase: "initial",
  showBody: false,
  dragOK: false,
  centreX: 0,
  frameFrozen: true,
  frameThick: false,
  pointerHover: false,
  showAnimatedCursor: false,
  cursorShouldExit: false,
  cursorTriggered: false,
  isAnimatingBack: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FRAME_ALIGNED":
      return { ...state, frameAligned: action.value };
    case "SET_SHOW_CURSOR":
      return { ...state, showCursor: action.value };
    case "SET_SHOW_FRAME":
      return { ...state, showFrame: action.value };
    case "SET_PHASE":
      return { ...state, phase: action.value };
    case "SET_SHOW_BODY":
      return { ...state, showBody: action.value };
    case "SET_DRAG_OK":
      return { ...state, dragOK: action.value };
    case "SET_CENTRE_X":
      return { ...state, centreX: action.value };
    case "SET_FRAME_FROZEN":
      return { ...state, frameFrozen: action.value };
    case "SET_FRAME_THICK":
      return { ...state, frameThick: action.value };
    case "SET_POINTER_HOVER":
      return { ...state, pointerHover: action.value };
    case "SET_SHOW_ANIMATED_CURSOR":
      return { ...state, showAnimatedCursor: action.value };
    case "SET_CURSOR_SHOULD_EXIT":
      return { ...state, cursorShouldExit: action.value };
    case "SET_CURSOR_TRIGGERED":
      return { ...state, cursorTriggered: action.value };
    case "SET_IS_ANIMATING_BACK":
      return { ...state, isAnimatingBack: action.value };
    default:
      return state;
  }
}

const useHeroAnimation = ({ frameRef, bodyRef, x, y, markIntroSeen }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pendingSnapBack, setPendingSnapBack] = useState(false);
  const [cursorKey, setCursorKey] = useState(0);
  const cursorTimerRef = useRef(null);

  const handleCursorReadyToDrag = useCallback(async () => {
    if (frameRef.current && bodyRef.current) {
      const frameRect = frameRef.current.getBoundingClientRect();
      const bodyRect = bodyRef.current.getBoundingClientRect();
      const targetLeft = bodyRect.left;
      const currentLeft = frameRect.left;
      const deltaNeeded = targetLeft - currentLeft;
      const finalX = x.get() + deltaNeeded;
      dispatch({ type: "SET_CENTRE_X", value: finalX });
      dispatch({ type: "SET_FRAME_FROZEN", value: false });
      dispatch({ type: "SET_FRAME_THICK", value: true });
      await animate(x, finalX, { type: "spring", stiffness: 55, damping: 18 });
      dispatch({ type: "SET_FRAME_THICK", value: false });
      dispatch({ type: "SET_PHASE", value: "frameMoved" });
      dispatch({ type: "SET_FRAME_ALIGNED", value: true });
      await new Promise((r) => setTimeout(r, 500));
      dispatch({ type: "SET_CURSOR_SHOULD_EXIT", value: true });
    }
  }, [bodyRef, frameRef, x]);

  const handleCursorDragComplete = useCallback(() => {
    dispatch({ type: "SET_SHOW_ANIMATED_CURSOR", value: false });
    dispatch({ type: "SET_IS_ANIMATING_BACK", value: false });
    dispatch({ type: "SET_DRAG_OK", value: true });
    markIntroSeen();
  }, [markIntroSeen]);

  useEffect(() => {
    if (
      state.showFrame &&
      state.showBody &&
      state.frameFrozen &&
      !state.showAnimatedCursor &&
      !state.cursorTriggered
    ) {
      dispatch({ type: "SET_CURSOR_TRIGGERED", value: true });
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
      cursorTimerRef.current = setTimeout(() => {
        dispatch({ type: "SET_SHOW_ANIMATED_CURSOR", value: true });
      }, 100);
    }
  }, [
    state.showFrame,
    state.showBody,
    state.frameFrozen,
    state.showAnimatedCursor,
    state.cursorTriggered,
  ]);

  useEffect(() => {
    return () => {
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
    };
  }, []);

  const snapBack = useCallback(() => {
    dispatch({ type: "SET_DRAG_OK", value: false });
    dispatch({ type: "SET_IS_ANIMATING_BACK", value: true });
    setPendingSnapBack(true);
    dispatch({ type: "SET_CURSOR_SHOULD_EXIT", value: false });
    setCursorKey((k) => k + 1);
    dispatch({ type: "SET_SHOW_ANIMATED_CURSOR", value: true });
  }, []);

  const handleCursorReadyToDragSnap = useCallback(async () => {
    if (pendingSnapBack) {
      dispatch({ type: "SET_FRAME_THICK", value: true });
      try {
        await Promise.all([
          animate(x, state.centreX, {
            type: "spring",
            stiffness: 65,
            damping: 18,
          }),
          animate(y, 0, { type: "spring", stiffness: 65, damping: 18 }),
        ]);
      } catch (e) {
        return;
      }
      dispatch({ type: "SET_FRAME_THICK", value: false });
      dispatch({ type: "SET_IS_ANIMATING_BACK", value: false });
      setPendingSnapBack(false);
      dispatch({ type: "SET_CURSOR_SHOULD_EXIT", value: true });
    } else {
      handleCursorReadyToDrag();
    }
  }, [pendingSnapBack, state.centreX, x, y, handleCursorReadyToDrag]);

  return {
    state,
    dispatch,
    cursorKey,
    pendingSnapBack,
    snapBack,
    handleCursorDragComplete,
    handleCursorReadyToDragSnap,
  };
};

export default useHeroAnimation;

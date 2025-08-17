import { useEffect, useRef } from 'react';

// Custom hook for focus management and accessibility
export const useFocusManagement = (isOpen) => {
  const lastFocusedElement = useRef(null);
  const firstFocusableElement = useRef(null);
  const lastFocusableElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      lastFocusedElement.current = document.activeElement;
      
      // Focus the first focusable element in the modal/menu
      setTimeout(() => {
        if (firstFocusableElement.current) {
          firstFocusableElement.current.focus();
        }
      }, 100);
    } else {
      // Return focus to the previously focused element
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      // Close modal/menu on escape
      return true; // Indicates should close
    }

    if (event.key === 'Tab') {
      // Trap focus within the modal/menu
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const focusableArray = Array.from(focusableElements);
      const firstElement = focusableArray[0];
      const lastElement = focusableArray[focusableArray.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    return false;
  };

  return {
    firstFocusableElement,
    lastFocusableElement,
    handleKeyDown,
  };
};

// Hook for skip link functionality
export const useSkipLink = () => {
  const skipToMain = () => {
    const mainContent = document.querySelector('main') || document.querySelector('#main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { skipToMain };
};

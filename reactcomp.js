import React, { useEffect, useCallback, useState } from 'react';

const InfiniteTicker = () => {
  const [isTabFocus, setIsTabFocus] = useState(false);

  const calculateVisibility = (element) => {
    const rect = element.getBoundingClientRect();
    const tickerWidth = document.querySelector('.ticker-list').offsetWidth;
    const isVisible = rect.left >= 0 && rect.right <= tickerWidth;
    return isVisible;
  };

  const updateVisibility = useCallback(() => {
    const tickerItems = document.querySelectorAll('.ticker-list li');
    tickerItems.forEach((item) => {
      const isVisible = calculateVisibility(item);
      item.tabIndex = isVisible && isTabFocus ? 0 : -1;
    });
  }, [isTabFocus]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateVisibility();
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, [updateVisibility]);

  const handleTabKeyPress = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      const currentFocused = document.activeElement;

      // Move focus to the next item
      const nextItem = currentFocused.nextElementSibling;
      if (nextItem) {
        setIsTabFocus(true);
        nextItem.tabIndex = 0;
        nextItem.focus();
        setIsTabFocus(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleTabKeyPress);
    return () => {
      document.removeEventListener('keydown', handleTabKeyPress);
    };
  }, [handleTabKeyPress]);

  useEffect(() => {
    updateVisibility(); // Initialize visibility
  }, [updateVisibility]);

  return (
    // JSX for your infinite ticker component
    // Make sure to include .ticker-container, .ticker-list, and ticker items appropriately
  );
};

export default InfiniteTicker;

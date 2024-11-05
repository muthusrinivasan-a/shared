// src/components/OptimizedComponent/OptimizedComponent.js

import React, { useState, useMemo, useEffect } from 'react';
import { largeDataset } from '../../data';
import Card from '../Card/Card';
import debounce from '../../utils/debounce';
import throttle from '../../utils/throttle';

function OptimizedComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(largeDataset);

  // Memoized filtering logic to avoid recalculating on each render.
  // Improves Web Vitals:
  // - **FCP (First Contentful Paint)**: Reduces load time by optimizing data processing,
  //   allowing the initial content to paint faster.
  // - **TBT (Total Blocking Time)**: Minimizes main-thread work, reducing overall blocking time.
  const filteredData = useMemo(() => {
    return largeDataset.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Debounced search handler to reduce state updates
  // Improves Web Vitals:
  // - **FID (First Input Delay)**: Limits the frequency of input handling,
  //   making the search input more responsive.
  // - **TBT (Total Blocking Time)**: Reduces main-thread blocking by avoiding
  //   excessive state updates during typing.
  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  // Throttled scroll handler to avoid excessive event calls
  // Improves Web Vitals:
  // - **CLS (Cumulative Layout Shift)**: Controls scroll event frequency,
  //   leading to smoother scrolling and less layout shift.
  // - **TBT (Total Blocking Time)**: Reduces the main-thread blocking time
  //   by limiting scroll event handling frequency.
  const handleScroll = throttle(() => {
    console.log("User scrolled the page");
  }, 500);

  // Set filtered items when search term changes
  useEffect(() => {
    setFilteredItems(filteredData);
  }, [filteredData]);

  // Attach throttled scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h2>Optimized Component</h2>
      <input
        type="text"
        placeholder="Search items..."
        onChange={handleSearchChange}
        style={{ padding: "8px", marginBottom: "20px", width: "100%" }}
      />
      <div className="cards-container">
        {filteredItems.map((item) => (
          <Card key={item.id} title={item.title} description={item.description} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default OptimizedComponent;

// src/components/OptimizedComponent/OptimizedComponent.js

import React, { useState, useMemo, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { largeDataset } from '../../data';
import Card from '../Card/Card';
import debounce from '../../utils/debounce';
import throttle from '../../utils/throttle';
import '../../reset.css'; // Import reset styles
import './OptimizedComponent.css'; // Import component-specific styles

function OptimizedComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(largeDataset);

  // Memoized filtering logic to avoid recalculating on each render.
  const filteredData = useMemo(() => {
    return largeDataset.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Debounced search handler to reduce state updates
  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  // Throttled scroll handler to avoid excessive event calls
  const handleScroll = throttle(() => {
    console.log("User scrolled the page");
  }, 500);

  useEffect(() => {
    setFilteredItems(filteredData);
  }, [filteredData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Calculate rows: Each row will display 3 items
  const rowCount = Math.ceil(filteredItems.length / 3);

  // Row renderer function for react-window
  const Row = ({ index, style }) => {
    const startIndex = index * 3;
    const items = filteredItems.slice(startIndex, startIndex + 3);

    return (
      <div className="grid-row" style={style}>
        {items.map((item) => (
          <Card key={item.id} title={item.title} description={item.description} image={item.image} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Optimized Component with Virtualized Grid</h2>
      <input
        type="text"
        placeholder="Search items..."
        onChange={handleSearchChange}
        style={{ padding: "8px", marginBottom: "20px", width: "100%" }}
      />
      <div className="cards-container">
        {/* Virtualized List using react-window */}
        <List
          height={600}                    // Height of the visible area
          itemCount={rowCount}             // Number of rows (3 items per row)
          itemSize={250}                   // Height of each row
          width="100%"                     // Width of the container
        >
          {Row}
        </List>
      </div>
    </div>
  );
}

export default OptimizedComponent;

// src/components/UnoptimizedComponent/UnoptimizedComponent.js

import React, { useState } from 'react';
import { largeDataset } from '../../data';
import Card from '../Card/Card';

function UnoptimizedComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic without memoization or optimization
  // Potential impact on Web Vitals:
  // - **FCP (First Contentful Paint)**: Delays initial paint by recalculating on each render.
  // - **TBT (Total Blocking Time)**: Increases main-thread blocking time, affecting load performance.
  const filteredItems = largeDataset.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Direct search change handler without debounce
  // Potential impact on Web Vitals:
  // - **FID (First Input Delay)**: Excessive state updates during typing,
  //   making input response slower.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Unoptimized scroll handler
  // Potential impact on Web Vitals:
  // - **CLS (Cumulative Layout Shift)**: Frequent scroll event handling may cause layout shifts.
  // - **TBT (Total Blocking Time)**: Increases main-thread blocking due to frequent event calls.
  const handleScroll = () => {
    console.log("User scrolled the page");
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <h2>Unoptimized Component</h2>
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

export default UnoptimizedComponent;

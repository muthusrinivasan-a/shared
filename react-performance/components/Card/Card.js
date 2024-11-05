// src/components/Card/Card.js

import React from 'react';
import './Card.css';

/**
 * Card component for displaying an individual item.
 * Uses React.memo to prevent unnecessary re-renders when props haven’t changed.
 * 
 * Improves Web Vitals:
 * - **FCP (First Contentful Paint)**: Reduces initial load time by avoiding unnecessary re-renders,
 *   allowing content to paint faster.
 * - **CLS (Cumulative Layout Shift)**: Reduces layout shifts by keeping the component stable
 *   and rendering only when props change.
 * - **TBT (Total Blocking Time)**: Reduces main-thread work by minimizing component re-renders.
 */
const Card = React.memo(({ title, description, image }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{description}</p>
    <picture>
      <source srcSet={image} media="(max-width: 600px)" />
      <img src={image} alt={`Image for ${title}`} loading="lazy" />
    </picture>
  </div>
));

export default Card;

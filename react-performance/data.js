// src/data.js

/**
 * A large dataset of mock items to simulate performance testing with search and scroll features.
 * Each item contains an ID, title, description, and a placeholder image URL.
 */

export const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  description: `Description for Item ${index + 1}`,
  image: `https://via.placeholder.com/300x200?text=Image+${index + 1}`
}));


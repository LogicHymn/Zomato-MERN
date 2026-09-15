import React from "react";

/**
 * CategoryBar component
 * Horizontal pill carousel to filter cuisines/categories
 */
function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  const categoryIcons = {
    All: "🔥",
    "Main Course": "🍛",
    Biryani: "🍚",
    Burgers: "🍔",
    Pizza: "🍕",
    "South Indian": "🥞",
    Dessert: "🍨",
    Beverages: "🥤",
  };

  return (
    <div className="category-filter-section">
      <div className="category-scroll-list">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => onSelectCategory(cat)}
          >
            <span>{categoryIcons[cat] || "🍽️"}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;

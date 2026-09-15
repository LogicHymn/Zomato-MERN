import React, { useState } from "react";

/**
 * ReelCard component
 * Vertical reel card showing culinary clips, restaurant name, and interaction controls
 */
function ReelCard({ reel }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="cravio-reel-card">
      <div className="reel-thumb-wrap">
        <img src={reel.image} alt={reel.dishName} className="reel-thumb-img" />
        <div className="reel-play-icon">▶</div>
        <div className="reel-duration-badge">{reel.duration}</div>
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className={`reel-like-btn ${liked ? "liked" : ""}`}
          title="Like Reel"
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="reel-info">
        <div className="reel-dish-title">{reel.dishName}</div>
        <div className="reel-restaurant-tag">🏪 {reel.restaurantName}</div>
        <div className="reel-metrics">🔥 {reel.likes} foodies watching</div>
      </div>
    </div>
  );
}

export default ReelCard;

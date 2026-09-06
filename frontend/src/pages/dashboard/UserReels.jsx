import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/cravio_reels.css";

function UserReels({ onTabChange }) {
  const navigate = useNavigate();

  // Reels list matching mockup and food themes
  const reels = [
    {
      id: 1,
      dishName: "Cheesy Loaded Fries",
      dishDesc: "Crispy fries loaded with cheese & herbs 🧀",
      price: "₹199",
      caption: "Cheesy, crispy and absolutely irresistible! 🤤 This one’s a must try!",
      tags: "#CheesyCravings #LoadedFries #Foodie",
      audio: "Original Sound - Cheesy Cravings",
      creator: "Cheesy Cravings",
      followers: "2.4K Followers",
      creatorImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80",
      mediaImg: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
      dishThumb: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=120&q=80",
      likesCount: "12.5K",
      commentsCount: "256",
      sharesCount: "812",
      bookmarksCount: "3.4K",
    },
    {
      id: 2,
      dishName: "Cheese Pull Margherita",
      dishDesc: "Fresh mozzarella and basil sourdough pizza 🍕",
      price: "₹349",
      caption: "That satisfying cheese pull you’ve been waiting for all day! 🍕✨",
      tags: "#PizzaLove #CheesePull #CravioBites",
      audio: "Original Sound - PizzaHub Live",
      creator: "Pizza Hub Official",
      followers: "18.2K Followers",
      creatorImg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80",
      mediaImg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      dishThumb: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80",
      likesCount: "24.1K",
      commentsCount: "430",
      sharesCount: "1.2K",
      bookmarksCount: "5.6K",
    },
    {
      id: 3,
      dishName: "Spicy Schezwan Noodles",
      dishDesc: "Wok-tossed noodles with fiery chili crunch 🍜",
      price: "₹220",
      caption: "Hot, steaming noodles right from the flame to your table! 🔥🍜",
      tags: "#SpicyNoodles #AsianStreetFood #WokMagic",
      audio: "Original Sound - NoodleNest Kitchen",
      creator: "Noodle Nest",
      followers: "9.7K Followers",
      creatorImg: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=120&q=80",
      mediaImg: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
      dishThumb: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=120&q=80",
      likesCount: "15.6K",
      commentsCount: "312",
      sharesCount: "940",
      bookmarksCount: "4.1K",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Reels"); // Reels vs Following
  const [followingMap, setFollowingMap] = useState({});
  const [likedMap, setLikedMap] = useState({ 0: true }); // first reel liked by default
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  const currentReel = reels[currentIndex];

  const handleFollowToggle = (e) => {
    e.stopPropagation();
    setFollowingMap((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    setBookmarkedMap((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const nextReel = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleNavClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      if (tab === "Home") navigate("/user/dashboard");
      if (tab === "Reels") navigate("/user/reels");
      if (tab === "Orders") navigate("/user/orders");
    }
  };

  return (
    <div className="cravio-reels-page">
      {/* Top Navbar */}
      <nav className="cravio-web-nav">
        <div className="cravio-web-nav-inner">
          <Link to="/" className="cravio-web-brand">
            <div className="cravio-web-brand-logo">
              <svg viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#F7A827" />
                <path
                  d="M13.5 9V17C13.5 19.5 15.5 21 17 21.5V27.5C17 28.05 17.45 28.5 18 28.5C18.55 28.5 19 28.05 19 27.5V21.5C20.5 21 22.5 19.5 22.5 17V9"
                  stroke="#15161A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M16.5 9V15M19.5 9V15" stroke="#15161A" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="cravio-web-brand-name">
              Cravio
              <span style={{ color: "#F7A827", transform: "translateY(-2px)", display: "inline-block" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F7A827">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </span>
          </Link>

          <div className="cravio-nav-links">
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Home")}>
              Home
            </button>
            <button type="button" className="cravio-nav-tab-btn active" onClick={() => handleNavClick("Reels")}>
              Reels
            </button>
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Orders")}>
              Orders
            </button>
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Favorites")}>
              Favorites
            </button>
          </div>
        </div>
      </nav>

      {/* Main Reels Center Container */}
      <main className="cravio-reels-main">
        {/* The Vertical Reel Player */}
        <div className="cravio-reel-viewport">
          {/* Background Media */}
          <img
            src={currentReel.mediaImg}
            alt={currentReel.dishName}
            className="cravio-reel-media"
          />

          {/* Gradients */}
          <div className="cravio-reel-top-gradient"></div>
          <div className="cravio-reel-bottom-gradient"></div>

          {/* 1. Header Bar: Reels vs Following + Search */}
          <div className="cravio-reel-top-nav">
            <div className="cravio-reel-tabs">
              <button
                type="button"
                className={`cravio-reel-tab ${activeTab === "Reels" ? "active" : ""}`}
                onClick={() => setActiveTab("Reels")}
              >
                Reels
              </button>
              <button
                type="button"
                className={`cravio-reel-tab ${activeTab === "Following" ? "active" : ""}`}
                onClick={() => setActiveTab("Following")}
              >
                Following
                <span className="cravio-reel-tab-dot" aria-hidden="true"></span>
              </button>
            </div>

            <button
              type="button"
              className="cravio-reel-search-btn"
              onClick={() => alert("Search reels, dishes and creators")}
              aria-label="Search"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* 2. Creator Profile Bar (Top-Left) */}
          <div className="cravio-reel-creator-pill">
            <img
              src={currentReel.creatorImg}
              alt={currentReel.creator}
              className="cravio-creator-avatar"
            />
            <div className="cravio-creator-info">
              <div className="cravio-creator-name">
                <span>{currentReel.creator}</span>
                <span className="cravio-verified-tick" title="Verified Creator">✔</span>
              </div>
              <span className="cravio-creator-followers">{currentReel.followers}</span>
            </div>
            <button
              type="button"
              className={`cravio-follow-btn ${followingMap[currentIndex] ? "following" : ""}`}
              onClick={handleFollowToggle}
            >
              {followingMap[currentIndex] ? "Following" : "Follow"}
            </button>
          </div>

          {/* 3. Floating Right Action Bar */}
          <div className="cravio-reel-actions-bar">
            {/* Like */}
            <button
              type="button"
              className="cravio-reel-action-btn"
              onClick={handleLikeToggle}
              aria-label="Like"
            >
              <div className={`cravio-action-circle ${likedMap[currentIndex] ? "liked" : ""}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={likedMap[currentIndex] ? "#EF4444" : "currentColor"}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="cravio-action-count">{currentReel.likesCount}</span>
            </button>

            {/* Comments */}
            <button
              type="button"
              className="cravio-reel-action-btn"
              onClick={() => alert(`View ${currentReel.commentsCount} comments`)}
              aria-label="Comments"
            >
              <div className="cravio-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="cravio-action-count">{currentReel.commentsCount}</span>
            </button>

            {/* Share */}
            <button
              type="button"
              className="cravio-reel-action-btn"
              onClick={() => alert("Share link copied to clipboard!")}
              aria-label="Share"
            >
              <div className="cravio-action-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <span className="cravio-action-count">{currentReel.sharesCount}</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              className="cravio-reel-action-btn"
              onClick={handleBookmarkToggle}
              aria-label="Bookmark"
            >
              <div className={`cravio-action-circle ${bookmarkedMap[currentIndex] ? "liked" : ""}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={bookmarkedMap[currentIndex] ? "#F7A827" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="cravio-action-count">{currentReel.bookmarksCount}</span>
            </button>

            {/* Audio Vinyl Disc */}
            <div className="cravio-vinyl-disc" title={currentReel.audio}>
              <img src={currentReel.dishThumb} alt="Audio cover" />
            </div>
          </div>

          {/* 4. Bottom Info: Dish Card + Caption + Audio */}
          <div className="cravio-reel-bottom-info">
            {/* Dish CTA Card */}
            <div className="cravio-reel-dish-card">
              <div className="cravio-dish-card-left">
                <img
                  src={currentReel.dishThumb}
                  alt={currentReel.dishName}
                  className="cravio-dish-thumb"
                />
                <div className="cravio-dish-card-details">
                  <h5>{currentReel.dishName}</h5>
                  <p>{currentReel.dishDesc}</p>
                  <div className="cravio-dish-price">{currentReel.price}</div>
                </div>
              </div>

              <button
                type="button"
                className="cravio-dish-order-btn"
                onClick={() => alert(`Order placed for ${currentReel.dishName} (${currentReel.price})!`)}
              >
                Order Now
              </button>
            </div>

            {/* Caption & Hashtags */}
            <p className="cravio-reel-caption">{currentReel.caption}</p>
            <div className="cravio-reel-tags">{currentReel.tags}</div>

            {/* Audio Tag */}
            <div className="cravio-reel-audio">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span>{currentReel.audio}</span>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Controls & Queue Panel */}
        <aside className="cravio-reels-desktop-panel">
          {/* Reel Nav Controls */}
          <div className="cravio-reel-nav-controls">
            <button
              type="button"
              className="cravio-reel-nav-arrow"
              onClick={prevReel}
              title="Previous Reel"
              aria-label="Previous reel"
            >
              ▲
            </button>
            <button
              type="button"
              className="cravio-reel-nav-arrow"
              onClick={nextReel}
              title="Next Reel"
              aria-label="Next reel"
            >
              ▼
            </button>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#9da4b0" }}>
              Reel {currentIndex + 1} of {reels.length}
            </span>
          </div>

          {/* Up Next Food Reels Queue */}
          <div className="cravio-reels-queue">
            <h4>Trending Food Reels</h4>
            <div className="cravio-queue-list">
              {reels.map((item, idx) => (
                <div
                  key={item.id}
                  className="cravio-queue-item"
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    border: currentIndex === idx ? "1px solid var(--cravio-gold)" : "none",
                  }}
                >
                  <img src={item.mediaImg} alt={item.dishName} className="cravio-queue-thumb" />
                  <div className="cravio-queue-info">
                    <h5>{item.dishName}</h5>
                    <span>{item.creator} • {item.likesCount} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Docked Bottom Navigation */}
      <nav className="cravio-bottom-nav" aria-label="Mobile Navigation">
        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Home")}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </button>

        <button type="button" className="cravio-nav-item active" onClick={() => handleNavClick("Reels")}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
          </svg>
          <span>Reels</span>
          <span className="cravio-nav-dot"></span>
        </button>

        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Orders")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Orders</span>
        </button>

        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Profile")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default UserReels;

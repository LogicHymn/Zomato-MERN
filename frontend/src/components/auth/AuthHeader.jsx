import React from "react";
import { Link } from "react-router-dom";

function AuthHeader({ badge, title, subtitle, badgeType = "user" }) {
  return (
    <header className="auth-header">
      <Link to="/" className="auth-brand" aria-label="Go to Home">
        <span className="auth-brand-logo">Cravio</span>
      </Link>
      {badge && (
        <div>
          <span className={`auth-badge ${badgeType}`}>{badge}</span>
        </div>
      )}
      <h1 className="auth-title">{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
    </header>
  );
}

export default AuthHeader;

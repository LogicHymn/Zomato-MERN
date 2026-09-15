import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer component
 */
function Footer() {
  return (
    <footer className="cravio-footer">
      <div className="footer-content" style={{ justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-light)" }}>
            cravio<span style={{ color: "var(--brand-primary)" }}>.</span>
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
            © {new Date().getFullYear()} CRAVIO Technologies Inc. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

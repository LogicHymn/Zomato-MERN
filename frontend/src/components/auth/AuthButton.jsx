import React from "react";

function AuthButton({ children, type = "button", onClick, className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`auth-btn ${className}`}
    >
      {children}
    </button>
  );
}

export default AuthButton;

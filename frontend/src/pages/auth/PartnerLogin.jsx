import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import InputField from "../../components/auth/InputField";
import AuthButton from "../../components/auth/AuthButton";

function PartnerLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.partnerLoginEmail.value.trim();
    const password = e.target.partnerLoginPassword.value;

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("cravioPartner", JSON.stringify(response.data.foodPartner));
        navigate("/partner/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          badge="Partner Portal"
          badgeType="partner"
          title="Food Partner Login"
          subtitle="Manage your restaurant menu, track live orders, and view business analytics"
        />

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <InputField
            id="partnerLoginEmail"
            label="Business Email"
            type="email"
            placeholder="contact@restaurant.com"
            autoComplete="email"
          />

          <InputField
            id="partnerLoginPassword"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            rightLabelAction={
              <span className="auth-link-text" style={{ cursor: "pointer", fontSize: "12px" }}>
                Forgot?
              </span>
            }
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Partner Portal"}
          </AuthButton>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-row">
            <span>New food partner?</span>
            <Link to="/partner/register" className="auth-link-text">
              Register restaurant
            </Link>
          </div>

          <div className="auth-switch-badge">
            Looking for food delivery?
            <Link to="/user/login">Customer Login</Link>
          </div>
        </footer>
      </AuthCard>
    </AuthLayout>
  );
}

export default PartnerLogin;

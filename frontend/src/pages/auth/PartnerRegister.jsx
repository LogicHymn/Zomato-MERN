import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import InputField from "../../components/auth/InputField";
import AuthButton from "../../components/auth/AuthButton";

function PartnerRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = e.target.name.value.trim();
    const restaurantName = e.target.restaurantName.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const address = e.target.address.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!name || !restaurantName || !email || !phone || !address || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        { name, email, password, phone, restaurantName, address },
        { withCredentials: true }
      );

      if (response.status === 201) {
        localStorage.setItem("cravioPartner", JSON.stringify(response.data.foodPartner));
        navigate("/partner/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          title="Register as Food Partner"
          subtitle="Partner with Cravio and expand your restaurant reach to thousands of customers"
        />

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <InputField
            id="name"
            label="Owner / Contact Name"
            type="text"
            placeholder="e.g. John Doe"
            autoComplete="name"
          />

          <InputField
            id="restaurantName"
            label="Restaurant Name"
            type="text"
            placeholder="e.g. Domino's Pizza / Burger King"
            autoComplete="organization"
          />

          <InputField
            id="email"
            label="Business Email"
            type="email"
            placeholder="contact@restaurant.com"
            autoComplete="email"
          />

          <InputField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            autoComplete="tel"
          />

          <InputField
            id="address"
            label="Restaurant Address"
            type="text"
            placeholder="e.g. 124 Commercial Street, City Center"
            autoComplete="street-address"
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Restaurant"}
          </AuthButton>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-row">
            <span>Already registered as a partner?</span>
            <Link to="/partner/login" className="auth-link-text">
              Log in
            </Link>
          </div>

          <div className="auth-switch-badge">
            Looking for food delivery?
            <Link to="/user/register">Customer Sign Up</Link>
          </div>
        </footer>
      </AuthCard>
    </AuthLayout>
  );
}

export default PartnerRegister;

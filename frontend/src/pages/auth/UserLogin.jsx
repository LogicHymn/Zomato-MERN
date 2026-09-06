import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import InputField from "../../components/auth/InputField";
import AuthButton from "../../components/auth/AuthButton";

function UserLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const identifier = e.target.identifier.value.trim();
    const password = e.target.password.value;

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("cravioUser", JSON.stringify(response.data.user));
        navigate("/user/dashboard");
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
          badge="Customer Portal"
          badgeType="user"
          title="Welcome Back"
          subtitle="Sign in to access your orders, bookmarks, and cart"
        />

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <InputField
            id="identifier"
            label="Email or Username"
            type="text"
            placeholder="name@example.com or username"
            autoComplete="username"
          />

          <InputField
            id="password"
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
            {loading ? "Signing in..." : "Sign In"}
          </AuthButton>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-row">
            <span>Don't have an account?</span>
            <Link to="/user/register" className="auth-link-text">
              Sign up
            </Link>
          </div>

          <div className="auth-switch-badge">
            Are you a restaurant partner?
            <Link to="/partner/login">Partner Portal</Link>
          </div>
        </footer>
      </AuthCard>
    </AuthLayout>
  );
}

export default UserLogin;

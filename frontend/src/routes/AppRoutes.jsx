import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Pages
import HomePage from "../pages/HomePage";
import UserLogin from "../pages/auth/UserLogin";
import UserSignup from "../pages/auth/UserSignup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import UserDashboard from "../pages/user/UserDashboard";
import DishPage from "../pages/user/DishPage";
import Checkout from "../pages/user/Checkout";
import Profile from "../pages/user/Profile";
import PartnerLogin from "../pages/partner/PartnerLogin";
import PartnerSignup from "../pages/partner/PartnerSignup";
import PartnerVerifyOtp from "../pages/partner/PartnerVerifyOtp";
import PartnerDashboard from "../pages/partner/PartnerDashboard";

/**
 * AppRoutes Component
 * Central router configuring all consumer and partner flows
 */
function AppRoutes() {
  return (
    <CartProvider>
      <Router>
        <div className="cravio-app">
          <Navbar />
          <main className="cravio-main">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* User Authentication Flows */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route path="/user/register" element={<UserSignup />} />
              <Route path="/user/verify-otp" element={<VerifyOtp />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              {/* User Dashboard & Ordering Flow */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/dish/:id" element={<DishPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />

              {/* Partner Flows */}
              <Route path="/partner/login" element={<PartnerLogin />} />
              <Route path="/partner/signup" element={<PartnerSignup />} />
              <Route path="/partner/register" element={<PartnerSignup />} />
              <Route path="/partner/verify-otp" element={<PartnerVerifyOtp />} />
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default AppRoutes;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import PartnerRegister from "../pages/auth/PartnerRegister";
import PartnerLogin from "../pages/auth/PartnerLogin";
import VerifyOtp from "../pages/auth/VerifyOtp";

import UserDashboard from "../pages/dashboard/UserDashboard";
import UserOrders from "../pages/dashboard/UserOrders";
import UserReels from "../pages/dashboard/UserReels";
import PartnerDashboard from "../pages/dashboard/PartnerDashboard";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/reels" element={<UserReels />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;

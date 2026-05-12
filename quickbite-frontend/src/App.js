// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import LoginModel from "./pages/LoginModel";
import SignupModel from "./pages/SignupModel";
import Restaurant from "./pages/Restaurant";
import AllRestaurants from "./pages/AllRestaurants";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembershipPlans from "./pages/AdminMembershipPlans";
import AdminCoupons from "./pages/AdminCoupons"; // ✅ NEW
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import UserOrders from "./pages/UserOrders";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import ContactUs from "./pages/ContactUs";
import MembershipPage from "./pages/MembershipPage";
import Chatbot from "./pages/Chatbot";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<AllRestaurants />} />
        <Route path="/restaurants/:id" element={<Restaurant />} />
        <Route path="/login" element={<LoginModel />} />
        <Route path="/signup" element={<SignupModel />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<Chatbot />} />

        {/* ---------------- USER MEMBERSHIP ---------------- */}
        <Route
          path="/membership"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MembershipPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- USER ORDERS ---------------- */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserOrders />
            </ProtectedRoute>
          }
        />

        {/* ---------------- VENDOR ---------------- */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN DASHBOARD ---------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN MEMBERSHIP ---------------- */}
        <Route
          path="/admin/membership"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMembershipPlans />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN COUPONS ---------------- */}
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCoupons />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN REDIRECT ---------------- */}
        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
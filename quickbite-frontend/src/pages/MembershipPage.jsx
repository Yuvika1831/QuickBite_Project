// src/pages/MembershipPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import MembershipCard from "../components/MembershipCard";
import CouponBox from "../components/CouponBox";
import "../styles/MembershipPage.css";

const MembershipPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("plans");

  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  // -----------------------------------
  // Fetch Plans
  // -----------------------------------
  const fetchMembershipPlans = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/membership/plans"
      );

      setPlans(res.data.plans || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Select Plan
  // -----------------------------------
  const handleBuyPlan = (plan) => {
    setSelectedPlan(plan);
    setFinalPrice(plan.price);
    setCouponCode("");
    setStep("coupon");
  };

  // -----------------------------------
  // Apply Coupon
  // -----------------------------------
  const handleApplyCoupon = async (code) => {
    if (!selectedPlan) {
      return alert("Please select a membership plan first");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/coupons/apply",
        {
          code,
          price: selectedPlan.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCouponCode(code);
      setFinalPrice(res.data.finalPrice);
      setStep("summary");

      alert(
        `Coupon Applied Successfully! Final Price: ₹${res.data.finalPrice}`
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Invalid or expired coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Skip Coupon
  // -----------------------------------
  const skipCoupon = () => {
    if (!selectedPlan) return;

    setFinalPrice(selectedPlan.price);
    setCouponCode("");
    setStep("summary");
  };

  // -----------------------------------
  // Final Buy
  // -----------------------------------
  const handleFinalBuy = async () => {
    try {
      if (!token) {
        return alert("Please login first");
      }

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/membership/buy",
        {
          planId: selectedPlan.id,
          finalPrice,
          couponCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStep("success");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to activate membership"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="membership-container">

      <h1>💎 Membership Plans</h1>

      {loading && <p>Loading...</p>}

      {/* ---------------- PLAN STEP ---------------- */}
      {step === "plans" && (
        <div className="plans-grid">
          {plans.length === 0 ? (
            <p>No membership plans available</p>
          ) : (
            plans.map((plan) => (
              <MembershipCard
                key={plan.id}
                plan={plan}
                onBuy={handleBuyPlan}
              />
            ))
          )}
        </div>
      )}

      {/* ---------------- COUPON STEP ---------------- */}
      {step === "coupon" && (
        <div className="coupon-box">
          <h2>
            Apply Coupon for{" "}
            <strong>{selectedPlan?.name}</strong>
          </h2>

          <p>
            Original Price: ₹{selectedPlan?.price}
          </p>

          <CouponBox onApply={handleApplyCoupon} />

          <button
            className="skip-btn"
            onClick={skipCoupon}
          >
            Skip Coupon
          </button>
        </div>
      )}

      {/* ---------------- SUMMARY STEP ---------------- */}
      {step === "summary" && (
        <div className="summary-box">
          <h2>🧾 Order Summary</h2>

          <p>
            <strong>Plan:</strong>{" "}
            {selectedPlan?.name}
          </p>

          <p>
            <strong>Original Price:</strong> ₹
            {selectedPlan?.price}
          </p>

          {couponCode && (
            <p>
              <strong>Coupon Applied:</strong>{" "}
              {couponCode}
            </p>
          )}

          <p>
            <strong>Final Price:</strong> ₹
            {finalPrice}
          </p>

          <button onClick={handleFinalBuy}>
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      )}

      {/* ---------------- SUCCESS STEP ---------------- */}
      {step === "success" && (
        <div className="success-box">
          <h2>🎉 Membership Activated Successfully!</h2>

          <p>
            Your premium membership is now active.
          </p>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
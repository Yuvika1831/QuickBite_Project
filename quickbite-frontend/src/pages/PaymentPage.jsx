// src/pages/Payment.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { items, total, userName } = state || {};

  if (!items) return <p>No order details found.</p>;

  const handlePayment = () => {
    navigate("/order-success", {
      state: { userName, total },
    });
  };

  return (
    <div className="payment-page" style={{ maxWidth: "600px", margin: "auto" }}>
      <h1>Payment Page</h1>

      <h2>Customer: <span style={{ color: "#ff4500" }}>{userName}</span></h2>

      <h3>Order Summary</h3>
      {items.map((item) => (
        <p key={item.id}>
          {item.name} × {item.quantity} — ₹{item.price * item.quantity}
        </p>
      ))}

      <h2>Total Payable Amount: ₹{total}</h2>

      <button
        style={{
          padding: "12px",
          width: "100%",
          marginTop: "20px",
          borderRadius: "10px",
          background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
}
// src/pages/UserOrders.jsx
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/UserOrders.css";

const UserOrders = ({ isOpen, onClose }) => {
  const { userOrders } = useContext(UserContext);

  if (!isOpen) return null;

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>My Orders</h2>
        {userOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders-grid">
            {userOrders.map(order => (
              <div key={order.orderId} className="order-card">
                <h3>Order #{order.orderId}</h3>
                <p>Restaurant: {order.restaurantName || "N/A"}</p>
                <p>Total: ₹{order.total}</p>
                <p>Status: <strong>{order.status}</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;

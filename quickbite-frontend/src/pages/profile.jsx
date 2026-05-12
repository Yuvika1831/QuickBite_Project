// src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {

        /* =========================================
           USER PROFILE
        ========================================= */

        const userRes = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(userRes.data);

        /* =========================================
           ORDER HISTORY
        ========================================= */

        const orderRes = await axios.get(
          "http://localhost:5000/api/users/me/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(orderRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="profile-loader">
        <div className="loader-circle"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  /* =========================================
     NO TOKEN
  ========================================= */

  if (!token) {
    return (
      <div className="profile-message">
        Please login first
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="profile-message error">
        {error}
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <div className="profile-hero">

        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h1>My Profile</h1>

        <p>
          Manage your account and track your
          delicious orders 🍕
        </p>
      </div>

      {/* =========================================
          USER CARD
      ========================================= */}

      {user && (
        <div className="profile-card">

          <div className="profile-info">
            <h2>{user.name}</h2>

            <p>{user.email}</p>
          </div>

          {/* Premium Button */}

          <Link to="/membership">
            <button className="premium-btn">
              Upgrade to Premium ✨
            </button>
          </Link>
        </div>
      )}

      {/* =========================================
          ORDER HISTORY
      ========================================= */}

      <div className="orders-section">

        <h2 className="orders-heading">
          Order History
        </h2>

        {orders.length === 0 ? (

          <div className="empty-orders">
            <h3>No orders yet 🍽</h3>

            <p>
              Start ordering your favourite food
              from QuickBite.
            </p>
          </div>

        ) : (

          <div className="orders-grid">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-top">

                  <h3>
                    {order.restaurant?.name || "N/A"}
                  </h3>

                  <span className="order-status">
                    {order.status}
                  </span>
                </div>

                <div className="order-details">

                  <p>
                    <strong>Total:</strong> ₹
                    {order.total}
                  </p>

                  <p>
                    <strong>Items:</strong>
                  </p>

                  <ul>
                    {order.items?.map((item) => (
                      <li key={item.id}>
                        {item.menuItem?.name} ×{" "}
                        {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

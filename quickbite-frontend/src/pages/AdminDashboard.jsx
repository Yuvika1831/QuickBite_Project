import React, { useState, useEffect } from "react";
import api from "../api/api";
import { socket } from "../Socket";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [ordersCount, setOrdersCount] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // -------------------------
  // Fetch restaurants
  // -------------------------
  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data);

      const counts = {};
      res.data.forEach((restaurant) => {
        counts[restaurant.id] = restaurant.orderCount || 0;
      });

      setOrdersCount(counts);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // -------------------------
  // Socket - new orders
  // -------------------------
  useEffect(() => {
    const handleNewOrder = (orderData) => {
      setOrdersCount((prev) => ({
        ...prev,
        [orderData.restaurantId]:
          (prev[orderData.restaurantId] || 0) + 1,
      }));
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  // -------------------------
  // Toggle Featured Restaurant
  // -------------------------
  const toggleFeatured = async (restaurant) => {
    try {
      await api.post("/admin/featured-restaurants", {
        id: restaurant.id,
        isFeatured: !restaurant.isFeatured,
      });

      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // Delete Restaurant
  // -------------------------
  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <h1>🔥 Admin Dashboard</h1>

        <div className="admin-nav">
          <button onClick={() => navigate("/admin")}>
            🏠 Restaurants
          </button>

          <button
            onClick={() =>
              navigate("/admin/membership")
            }
          >
            💎 Membership Plans
          </button>

          <button
            onClick={() =>
              navigate("/admin/coupons")
            }
          >
            🎟 Manage Coupons
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Restaurants</h3>
          <p>{restaurants.length}</p>
        </div>

        <div className="stat-card">
          <h3>Featured Restaurants</h3>
          <p>
            {
              restaurants.filter(
                (r) => r.isFeatured
              ).length
            }
          </p>
        </div>
      </div>

      {/* RESTAURANTS */}
      <h2>Restaurants Overview</h2>

      <div className="restaurant-list">
        {restaurants.length === 0 && (
          <p>No restaurants found.</p>
        )}

        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="restaurant-card"
          >
            {restaurant.image && (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
            )}

            <div className="restaurant-details">
              <h3>{restaurant.name}</h3>

              <p>
                Category: {restaurant.category}
              </p>

              <p>
                Featured:{" "}
                <strong>
                  {restaurant.isFeatured
                    ? "Yes"
                    : "No"}
                </strong>
              </p>

              <p>
                Orders:{" "}
                <strong>
                  {ordersCount[restaurant.id] || 0}
                </strong>
              </p>
            </div>

            <div className="restaurant-actions">
              <button
                className={`featured-btn ${
                  restaurant.isFeatured
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleFeatured(restaurant)
                }
              >
                {restaurant.isFeatured
                  ? "Unmark Featured"
                  : "Mark Featured"}
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteRestaurant(restaurant.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
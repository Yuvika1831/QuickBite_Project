import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import MenuItemCard from "../components/MenuItemCard";
import { CartContext } from "../context/CartContext";
import "../styles/Restaurant.css";

export default function Restaurant() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/restaurants/${id}`);
        setRestaurant(res.data);
        setMenuItems(res.data.menuItems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="restaurants-list">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurants-list">
        <p className="loading-text">Restaurant not found</p>
      </div>
    );
  }

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  const handleCheckout = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  return (
    <div className="restaurants-list">

      {/* HERO SECTION */}
      <div className="restaurant-hero">

        {/* IMAGE WRAPPER FIX (IMPORTANT) */}
        {restaurant.image && (
          <div className="image-wrapper">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-image"
            />
          </div>
        )}

        <h2 className="restaurant-name">
          {restaurant.name}
        </h2>

        <p className="restaurant-category">
          {restaurant.category}
        </p>

      </div>

      {/* MENU SECTION */}
      <div className="menu-section">

        <h3 className="menu-heading">
          Menu Items
        </h3>

        <div className="menu-items-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                menuItem={item}
                isUserView={true}
                onAddToCart={handleAddToCart}
                onCheckout={handleCheckout}
              />
            ))
          ) : (
            <p>No menu items available</p>
          )}
        </div>

      </div>

    </div>
  );
}

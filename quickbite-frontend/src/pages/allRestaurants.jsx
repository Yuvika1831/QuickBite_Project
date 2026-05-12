import React, { useEffect, useState } from "react";
import api from "../api/api";
import RestaurantCard from "../components/RestaurantCard";
import "../styles/AllRestaurant.css";

export default function AllRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurants();
  }, []);

  if (restaurants.length === 0) {
    return (
      <div className="all-restaurants-wrapper">
        <p className="loading-text">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="all-restaurants-wrapper">
      <h1>All Restaurants</h1>

      <div className="restaurant-cards-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
}

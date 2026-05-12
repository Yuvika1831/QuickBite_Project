import React, { useState } from "react";
import "../styles/AddRestaurantForm.css";

const AddRestaurantForm = ({ onRestaurantAdded }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !image || !checkoutTime)
      return alert("Please fill all fields including image and checkout time");

    setLoading(true);

    try {
      await onRestaurantAdded({
        name,
        category,
        image,
        checkoutTime: parseInt(checkoutTime, 10),
      });

      setName("");
      setCategory("");
      setImage("");
      setCheckoutTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to add restaurant.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="add-restaurant-page">

    {/* background emojis ONLY */}
    <div className="floating-icons">
      <span>🍕</span>
      <span>🍔</span>
      <span>🍟</span>
      <span>☕</span>
      <span>🌮</span>
      <span>🍩</span>
      <span>🍜</span>
      <span>🥤</span>
      <span>🍕</span>
      <span>🍔</span>
    </div>

    {/* ONLY ONE CARD */}
    <div className="add-restaurant-form">
      <h2>Add Your Restaurant</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input
          type="number"
          placeholder="Checkout Time"
          value={checkoutTime}
          onChange={(e) => setCheckoutTime(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Restaurant"}
        </button>
      </form>
    </div>

  </div>
);
};

export default AddRestaurantForm;

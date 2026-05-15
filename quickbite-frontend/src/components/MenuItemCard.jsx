// src/components/MenuItemCard.jsx
import React from "react";
import "../styles/MenuItemCard.css";

const MenuItemCard = ({ menuItem, isUserView, onEdit, onDelete, onAddToCart, onCheckout }) => {
  return (
    <div className="menu-item-card">
      {menuItem.image && (
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="menu-item-image"
        />
      )}
      <h4>{menuItem.name}</h4>
      <p>{menuItem.description}</p>
      <p>₹{menuItem.price}</p>

      {/* Vendor buttons */}
      {!isUserView && (onEdit || onDelete) && (
        <div className="menu-item-buttons">
          {onEdit && (
            <button className="edit-btn" onClick={() => onEdit(menuItem)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="delete-btn" onClick={() => onDelete(menuItem.id)}>
              Delete
            </button>
          )}
        </div>
      )}

      {/* User buttons: Add to Cart & Checkout */}
      {isUserView && (
        <div className="menu-item-buttons">
          {onAddToCart && (
            <button className="add-cart-btn" onClick={() => onAddToCart(menuItem)}>
              Add to Cart
            </button>
          )}
          {onCheckout && (
            <button className="order-now-btn" onClick={() => onCheckout(menuItem)}>
              Checkout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;

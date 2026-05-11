import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/CartItem.css";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useContext(CartContext);

  const handleIncrease = () => {
    addToCart(item, 1); // increase quantity by 1
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      addToCart(item, -1); // decrease quantity by 1
    } else {
      removeFromCart(item.id); // remove item if quantity reaches 0
    }
  };

  return (
    <div className="cart-item-card">
      {item.image && <img src={item.image} alt={item.name} />}

      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <p className="price">₹{item.price}</p>

        <div className="quantity-controls">
          <button onClick={handleDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      </div>

      <button
        className="cart-item-remove-btn"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import "../styles/Cart.css";

const Cart = ({ isOpen, onClose }) => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const validItems = cartItems.filter(Boolean);

  const total = validItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    if (validItems.length === 0) return;
    onClose(); // close cart panel
    // Navigate to Checkout page and pass cart items
    navigate("/checkout", { state: { cartItems: validItems } });
  };

  return (
    <div className={`cart-panel ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>My Cart</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {validItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items-grid">
          {validItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {validItems.length > 0 && (
        <div className="cart-total">
          <p>Total: ₹{total}</p>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
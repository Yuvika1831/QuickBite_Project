// src/pages/Checkout.jsx
import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import api from "../api/api";
import { socket } from "../Socket";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const orderItems = location.state?.orderItems || [];

  const { user } = useContext(UserContext);
  const { cartItems } = useContext(CartContext);

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
  });

  const [paymentMethod] = useState("Cash");

  const [membership, setMembership] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(40);

  // ---------------- LOAD ITEMS (REORDER + CART FIX) ----------------
  useEffect(() => {
    if (orderItems && orderItems.length > 0) {
      const normalized = orderItems.map((i) => ({
        id: i.menuItem?.id || i.id,
        name: i.menuItem?.name || i.name,
        price: i.menuItem?.price || i.price,
        quantity: i.quantity || 1,
        restaurantId: i.restaurantId,
      }));

      setItems(normalized);
    } else {
      setItems(cartItems);
    }
  }, [orderItems, cartItems]);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!user?.id) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", {
      userId: user.id,
      role: "USER",
    });
  }, [user]);

  // ---------------- COUPONS ----------------
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupons", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") ||
              sessionStorage.getItem("token")
            }`,
          },
        });

        setCoupons(res.data.coupons || []);
      } catch {
        setCoupons([]);
      }
    };

    fetchCoupons();
  }, []);

  // ---------------- MEMBERSHIP ----------------
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await api.get("/membership/my-membership", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") ||
              sessionStorage.getItem("token")
            }`,
          },
        });

        setMembership(res.data.membership);
      } catch {
        setMembership(null);
      }
    };

    fetchMembership();
  }, []);

  // ---------------- BILL CALCULATION ----------------
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (membership) setDeliveryCharge(0);
    else setDeliveryCharge(subtotal >= 500 ? 0 : 40);
  }, [membership, subtotal]);

  useEffect(() => {
    if (membership?.plan) {
      const plan = membership.plan;

      if (subtotal >= plan.minOrderAmount) {
        setMembershipDiscount((subtotal * plan.discountPercent) / 100);
      } else {
        setMembershipDiscount(0);
      }
    }
  }, [membership, subtotal]);

  const applyCoupon = async () => {
    if (membership) return alert("Coupon not allowed with membership");

    try {
      const res = await api.post(
        "/coupons/apply",
        { code: couponCode, price: subtotal },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") ||
              sessionStorage.getItem("token")
            }`,
          },
        }
      );

      setCouponDiscount(res.data.discountAmount || 0);
      alert("Coupon applied");
    } catch {
      alert("Invalid coupon");
    }
  };

  const totalAmount =
    subtotal + deliveryCharge - membershipDiscount - couponDiscount;

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    try {
      setIsLoading(true);

      const orderData = {
        userId: user.id,
        restaurantId: items[0]?.restaurantId,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        deliveryInfo,
        paymentMethod,
        total: totalAmount,
      };

      const res = await api.post("/orders/confirm", orderData, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") ||
            sessionStorage.getItem("token")
          }`,
        },
      });

      const orderId = res.data.orderId || res.data.order?.id;

      socket.emit("place-order", {
        orderId,
        restaurantId: items[0]?.restaurantId,
        items,
        userId: user.id,
        total: totalAmount,
      });

      navigate("/order-success", { state: { orderId } });
    } catch (err) {
      setStatus("Order failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">

      <h1 className="checkout-title">Checkout</h1>

      {/* ITEMS */}
      <div className="checkout-card">
        <h2>Items</h2>
        {items.map((item, idx) => (
          <div key={item.id || idx} className="item-row">
            <span>{item.name}</span>
            <span>₹{item.price} × {item.quantity}</span>
          </div>
        ))}
      </div>

      {/* COUPONS */}
      {!membership && (
        <div className="checkout-card">
          <h2>Coupons</h2>

          <div className="coupon-list">
            {coupons.map((c) => (
              <button
                key={c.id}
                className="coupon-chip"
                onClick={() => setCouponCode(c.code)}
              >
                {c.code} ({c.discount}%)
              </button>
            ))}
          </div>

          <div className="coupon-input">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon"
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
        </div>
      )}

      {/* BILL */}
      <div className="checkout-card">
        <h2>Bill Summary</h2>

        <p>Subtotal: ₹{subtotal}</p>
        <p>Delivery: ₹{deliveryCharge}</p>
        <p>Membership Discount: -₹{membershipDiscount.toFixed(2)}</p>
        <p>Coupon Discount: -₹{couponDiscount}</p>

        <h3 className="total">Total: ₹{totalAmount.toFixed(2)}</h3>
      </div>

      {/* DELIVERY */}
      <div className="checkout-card">
        <h2>Delivery Details</h2>

        <input
          placeholder="Name"
          value={deliveryInfo.name}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={deliveryInfo.phone}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
          }
        />

        <textarea
          placeholder="Address"
          value={deliveryInfo.address}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
          }
        />
      </div>

      {/* PLACE ORDER */}
      <button
        className="place-order-btn"
        onClick={placeOrder}
        disabled={isLoading}
      >
        {isLoading ? "Placing Order..." : "Place Order"}
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

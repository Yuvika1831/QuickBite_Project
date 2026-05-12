import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import Cart from "../pages/Cart";
import { socket } from "../Socket";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const { cartItems = [] } = useContext(CartContext);
  const { user, logout, notifications, setNotifications } =
    useContext(UserContext);

  const navigate = useNavigate();

  const toggleMobileMenu = () =>
    setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // ================= ROLE =================
  const role = user?.role?.toUpperCase();
  const isUser = role === "USER";
  const isVendor = role === "VENDOR";

  // ---------------- PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();

      if (!token || !user?.id || isVendor) return;

      try {
        const profileRes = await fetch(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profile = await profileRes.json();
        setProfileData(profile);

        const orderRes = await fetch(
          "http://localhost:5000/api/users/me/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orders = await orderRes.json();
        setOrderHistory(orders || []);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [user, isVendor]);

  // ---------------- SOCKET ----------------
  const handleOrderReceived = useCallback(
    (order) => {
      setNotifications((prev) => [
        { ...order, status: "Pending", isNew: true },
        ...prev,
      ]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.orderId === order.orderId
              ? { ...n, isNew: false }
              : n
          )
        );
      }, 1500);
    },
    [setNotifications]
  );

  useEffect(() => {
    if (!user?.id) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", {
      userId: user.id,
      role,
    });

    if (isVendor) {
      socket.on("order-received", handleOrderReceived);
    }

    return () => {
      socket.off("order-received", handleOrderReceived);
    };
  }, [user, role, isVendor, handleOrderReceived]);

  // ---------------- ACTIONS ----------------
  const confirmOrder = (order) => {
    socket.emit("update-order-status", {
      orderId: order.id || order.orderId,
      userId: order.userId,
      status: "Confirmed",
      total: order.total,
    });

    setNotifications((prev) =>
      prev.map((n) =>
        (n.id || n.orderId) === (order.id || order.orderId)
          ? { ...n, status: "Confirmed" }
          : n
      )
    );
  };

  const readyToDeliver = (order) => {
    socket.emit("update-order-status", {
      orderId: order.id || order.orderId,
      userId: order.userId,
      status: "Ready to Deliver",
      total: order.total,
    });

    setNotifications((prev) =>
      prev.filter(
        (n) =>
          (n.id || n.orderId) !== (order.id || order.orderId)
      )
    );
  };

  const membership = profileData?.membership || null;

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}
        <div className="logo">
          <Link to="/">QuickBite</Link>
        </div>

        {/* CENTER LINKS */}
        <div className={`navbar-center ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">

          {!user ? (
            <>
              <Link to="/login"><button className="nav-btn">Login</button></Link>
              <Link to="/signup"><button className="nav-btn">Signup</button></Link>
            </>
          ) : (
            <>
              {/* CART */}
              {isUser && (
                <div className="cart-icon-wrapper" onClick={toggleCart}>
                  🛒
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {isVendor && (
                <div className="notification-wrapper">
                  <button
                    className="nav-btn"
                    onClick={() =>
                      setShowNotifications(!showNotifications)
                    }
                  >
                    🔔
                    {notifications.length > 0 && (
                      <span className="badge">{notifications.length}</span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      {notifications.length === 0 ? (
                        <div className="notification-item">
                          No new orders
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id || n.orderId} className="notification-item">
                            <strong>Order #{n.id || n.orderId}</strong>
                            <p>User {n.userId} - ₹{n.total}</p>
                            <p>Status: {n.status}</p>

                            <button onClick={() => confirmOrder(n)}>Confirm</button>
                            <button onClick={() => readyToDeliver(n)}>Ready</button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE (USER ONLY) */}
              {isUser && (
                <div className="profile-wrapper">
                  <div
                    className="profile-icon"
                    onClick={() => setShowProfilePanel(true)}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="username">{user.name}</span>
                </div>
              )}

              {/* 🔥 LOGOUT (ALL ROLES) */}
              <button
                className="nav-btn logout-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>

              {/* HAMBURGER */}
              <div className="hamburger" onClick={toggleMobileMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* PROFILE PANEL */}
      {isUser && showProfilePanel && (
        <>
          <div
            className="profile-overlay"
            onClick={() => setShowProfilePanel(false)}
          ></div>

          <div className="profile-panel">
            <div className="profile-header">
              <h2>👤 My Profile</h2>
              <button
                className="close-btn"
                onClick={() => setShowProfilePanel(false)}
              >
                ✕
              </button>
            </div>

            <p><strong>Name:</strong> {profileData?.name || user?.name}</p>
            <p><strong>Email:</strong> {profileData?.email}</p>

            <h3>👑 Membership</h3>
            {membership ? (
              <div className="membership-card">
                <p>Status: <b style={{ color: "green" }}>Active</b></p>
                <p>Plan: {membership.plan?.name || "Premium"}</p>
              </div>
            ) : (
              <button onClick={() => navigate("/membership")}>
                Upgrade to Premium
              </button>
            )}

            <h3>🧾 Order History</h3>

            {orderHistory.map((o) => (
              <div key={o.id} className="order-card">
                <p><b>Order #{o.id}</b></p>

                {o.items?.map((item, idx) => (
                  <p key={idx}>
                    🍽 <b>{item.menuItem?.name}</b> × {item.quantity}
                  </p>
                ))}

                <p>💰 Total: ₹{o.total}</p>

                
               
              </div>
            ))}
          </div>
        </>
      )}

      {/* CART */}
      {isUser && (
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};

export default Navbar;

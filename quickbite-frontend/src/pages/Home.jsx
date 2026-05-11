import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../Socket";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import SignupModal from "./Signup";
import ChatbotButton from "../components/ChatbotButton";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFeaturedRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/restaurants");
      const featured = res.data.filter((r) => r.isFeatured);
      setRestaurants(featured);
    } catch (err) {
      console.error(err);
      setError("Failed to load featured restaurants");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFeaturedRestaurants().finally(() => setLoading(false));

    if (!socket.connected) socket.connect();
    socket.on("featured_restaurant_updated", fetchFeaturedRestaurants);
    socket.on("restaurant_deleted", (data) => {
      setRestaurants((prev) => prev.filter((r) => r.id !== data.restaurantId));
    });

    return () => {
      socket.off("featured_restaurant_updated");
      socket.off("restaurant_deleted");
    };
  }, []);

  if (loading) return <p>Loading featured restaurants...</p>;
  if (error) return <p>{error}</p>;

  const offers = [
    { id: 1, title: "Flat 50% Off on First Order", code: "WELCOME50" },
    { id: 2, title: "Free Delivery Above ₹299", code: "FREEDLVY" },
    { id: 3, title: "Buy 1 Get 1 Free on Pizza", code: "PIZZA1FREE" },
  ];

  const whyUs = [
    { icon: "⚡", title: "Lightning Fast", desc: "Average delivery in under 30 minutes, guaranteed fresh." },
    { icon: "🍽️", title: "500+ Restaurants", desc: "From local dhabas to premium dining — all in one place." },
    { icon: "💸", title: "Best Prices", desc: "Daily deals and exclusive offers save you money every order." },
    { icon: "🛡️", title: "Safe & Hygienic", desc: "Every partner restaurant is quality-checked and certified." },
  ];

  const trending = [
    { emoji: "🍕", name: "Margherita Pizza", sub: "Italian Classic", price: "₹199", badge: "🔥 Trending" },
    { emoji: "🍔", name: "Smash Burger", sub: "American Style", price: "₹149", badge: "⭐ Bestseller" },
    { emoji: "🍛", name: "Chicken Biryani", sub: "Hyderabadi Special", price: "₹179", badge: "🔥 Trending" },
    { emoji: "🍣", name: "Sushi Platter", sub: "Japanese Fusion", price: "₹349", badge: "✨ New" },
    { emoji: "🌮", name: "Veg Tacos", sub: "Tex-Mex Delight", price: "₹129", badge: "💚 Healthy" },
    { emoji: "🍰", name: "Choco Lava Cake", sub: "Must-Try Dessert", price: "₹99", badge: "🍫 Sweet" },
  ];

  const steps = [
    { icon: "📍", title: "Choose Location", desc: "Set your delivery address to see restaurants near you." },
    { icon: "🍽️", title: "Pick a Restaurant", desc: "Browse menus from top-rated places in your area." },
    { icon: "🛒", title: "Add to Cart", desc: "Select your favourite dishes and customise your order." },
    { icon: "🚀", title: "Fast Delivery", desc: "Sit back — your food arrives hot at your door." },
  ];


  const testimonials = [
    {
      name: "Anika Sharma",
      city: "Mumbai",
      quote: "Quickest delivery I've ever had. Food arrived piping hot in under 30 minutes!",
      stars: 5,
    },
    {
      name: "Ravi Mehta",
      city: "Bangalore",
      quote: "The variety of restaurants is incredible. Found my new favourite biryani spot here.",
      stars: 5,
    },
    {
      name: "Priya K.",
      city: "Delhi",
      quote: "Super easy to use app. The offers save me money every single week. Highly recommended!",
      stars: 4,
    },
  ];

  return (
    <div className="home-container">

    {/* ── HERO BANNER ── */}
<div className="hero">
  
  {/* Floating food emojis */}
  <div className="hero-food-bg">
    <span className="food-blob">🍽️</span>
    <span className="food-blob">⭐</span>
    <span className="food-blob">🍔</span>
    <span className="food-blob">🍕</span>
    <span className="food-blob">🚀</span>
  </div>

  <div className="hero-content">

    <h1>
      Discover <span>Top Rated</span> Food 🍽️
    </h1>

    <p>
      4.5★+ restaurants • Fast delivery • Best deals near you
    </p>

    {/* Rating stats instead of random numbers */}
    <div className="hero-stats">

      <div className="hero-stat">
        <strong>4.8★</strong>
        <span>Avg Rating</span>
      </div>

      <div className="hero-stat">
        <strong>1M+</strong>
        <span>Happy Users</span>
      </div>

      <div className="hero-stat">
        <strong>30 min</strong>
        <span>Fast Delivery</span>
      </div>

    </div>

    <button
      className="explore-btn"
      onClick={() => navigate("/restaurants")}
    >
      Explore Top Restaurants
    </button>

  </div>

</div>

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="section-header">
          <h2>Why <em>QuickBite?</em></h2>
        </div>
        <div className="why-grid">
          {whyUs.map((w, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

    
      {/* ── FEATURED RESTAURANTS ── */}
      <section className="restaurant-section">
        <div className="section-header">
          <h2>Featured <em>Restaurants</em></h2>
          <button className="see-all-btn" onClick={() => navigate("/restaurants")}>
            See all →
          </button>
        </div>

        <div className="restaurant-cards">
          {restaurants.length === 0 && <p>No featured restaurants</p>}

          {restaurants.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className={`restaurant-card ${!r.image ? "no-img" : ""}`}
              onClick={() => navigate(`/restaurants/${r.id}`)}
            >
              <div className="card-img-wrapper">
                {r.image
                  ? <img src={r.image} alt={r.name} />
                  : <span>🍽️</span>
                }
                <div className="featured-badge">Featured</div>
              </div>

              <div className="card-body">
                <h3>{r.name}</h3>
                <p className="category-tag">{r.category}</p>

                <div className="card-meta">
                  <span className="meta-chip"><span className="meta-icon">⭐</span> 4.5</span>
                  <span className="meta-chip"><span className="meta-icon">⏱</span> 25–35 min</span>
                  <span className="meta-chip"><span className="meta-icon">🛵</span> Free delivery</span>
                </div>

                <button onClick={(e) => { e.stopPropagation(); navigate(`/restaurants/${r.id}`); }}>
                  View Items
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <div className="promo-banner">
        <div className="promo-text">
          <h3>🎉 New User? Get 50% Off Your First Order</h3>
          <p>Sign up today and enjoy your favourite food at half the price!</p>
        </div>
        <button className="promo-cta" onClick={() => navigate("/signup")}>
          Claim Offer
        </button>
      </div>

      {/* ── OFFERS ── */}
      <section className="offers-section">
        <div className="section-header">
          <h2>Special <em>Offers</em></h2>
        </div>

        <div className="offers-list">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <h3>{offer.title}</h3>
              <p>
                Use Code: <strong>{offer.code}</strong>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-header">
          <h2>How It <em>Works</em></h2>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{i + 1}</div>
              <div className="step-icon">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our <em>Customers</em> Say</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
              <blockquote>"{t.quote}"</blockquote>
              <div className="reviewer">
                <div className="reviewer-avatar">
                  {t.name.charAt(0)}
                </div>
                <div className="reviewer-info">
                  <strong>{t.name}</strong>
                  <span>{t.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── APP DOWNLOAD BANNER ── */}
      <div className="app-banner">
        <div className="app-banner-text">
          <h3>📱 Get the QuickBite App</h3>
          <p>Exclusive app-only deals. Track orders in real-time. Reorder in one tap.</p>
        </div>
        <div className="app-badges">
          <div className="app-badge">
            <span className="badge-icon">🍎</span>
            App Store
          </div>
          <div className="app-badge">
            <span className="badge-icon">🤖</span>
            Google Play
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}

      {/* ── CHATBOT ── */}
      <ChatbotButton />

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-left">
            <h2>QuickBite 🍔</h2>
            <p>Delicious food delivered fast to your doorstep. Quality meals, every time.</p>
            <div className="footer-social">
              <div className="social-dot">𝕏</div>
              <div className="social-dot">f</div>
              <div className="social-dot">in</div>
              <div className="social-dot">📸</div>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <p onClick={() => navigate("/")}>Home</p>
            <p onClick={() => navigate("/restaurants")}>Restaurants</p>
            <p>Orders</p>
            <p>About Us</p>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📞 +91 98765 43210</p>
            <p>📧 support@quickbite.com</p>
            <p>📍 India</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
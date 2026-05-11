import React from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const cardStyles = {
    width: "100%",
    maxWidth: "310px",
    background: "#ffffff",
    borderRadius: "22px",
    overflow: "hidden",
    border: "1px solid rgba(255, 87, 34, 0.12)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    transition: "all 0.35s ease",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  const imageWrapperStyles = {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #fff0e6 0%, #ffd6b8 100%)",
  };

  const imageStyles = {
    width: "100%",
    height: "210px",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
  };

  const placeholderStyles = {
    width: "100%",
    height: "210px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "5rem",
    background:
      "linear-gradient(135deg, #fff0e6 0%, #ffd6b8 100%)",
  };

  const badgeStyles = {
    position: "absolute",
    top: "14px",
    left: "14px",
    background:
      "linear-gradient(135deg, #ff5722, #ff7043)",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "100px",
    fontSize: "0.72rem",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    boxShadow: "0 6px 16px rgba(255, 87, 34, 0.3)",
  };

  const contentStyles = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  const titleStyles = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#1A1209",
    marginBottom: "8px",
    textAlign: "center",
  };

  const cuisineStyles = {
    color: "#FF5722",
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textAlign: "center",
    marginBottom: "16px",
  };

  const metaStyles = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  };

  const chipStyles = {
    background: "rgba(255, 87, 34, 0.08)",
    color: "#7A6652",
    padding: "7px 12px",
    borderRadius: "100px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  const buttonStyles = {
    marginTop: "auto",
    width: "100%",
    padding: "12px 20px",
    border: "none",
    borderRadius: "100px",
    background:
      "linear-gradient(135deg, #ff5722, #ff7043)",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 22px rgba(255, 87, 34, 0.25)",
  };

  return (
    <div
      style={cardStyles}
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 20px 45px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.borderColor =
          "rgba(255, 87, 34, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor =
          "rgba(255, 87, 34, 0.12)";
      }}
    >
      {/* Image */}
      {restaurant.image ? (
        <div style={imageWrapperStyles}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            style={imageStyles}
          />

          <span style={badgeStyles}>
            Popular
          </span>
        </div>
      ) : (
        <div style={placeholderStyles}>
          🍽️
        </div>
      )}

      {/* Content */}
      <div style={contentStyles}>
        <h3 style={titleStyles}>
          {restaurant.name}
        </h3>

        {restaurant.cuisines && (
          <p style={cuisineStyles}>
            {restaurant.cuisines}
          </p>
        )}

        <div style={metaStyles}>
          {restaurant.rating && (
            <span style={chipStyles}>
              ⭐ {restaurant.rating}
            </span>
          )}

          <span style={chipStyles}>
            30 min
          </span>
        </div>

        <button
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-2px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 14px 30px rgba(255, 87, 34, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 22px rgba(255, 87, 34, 0.25)";
          }}
        >
          View Items
        </button>
      </div>
    </div>
  );
}

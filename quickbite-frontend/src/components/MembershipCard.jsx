import React from "react";
import "../styles/MembershipCard.css";

const MembershipCard = ({ plan, onBuy }) => {
  return (
    <div className="membership-card">
      <h2>{plan.name}</h2>
      <h3>₹{plan.price}</h3>
      <p>{plan.benefits}</p>

      <button onClick={() => onBuy(plan)}>
        Buy Membership
      </button>
    </div>
  );
};

export default MembershipCard;
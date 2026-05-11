import React, { useState } from "react";

const CouponBox = ({ onApply }) => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code.trim()) {
      return alert("Please enter coupon code");
    }

    onApply(code);
  };

  return (
    <div>
      <h2>Apply Coupon</h2>

      <input
        type="text"
        placeholder="Enter Coupon Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Apply Coupon
      </button>
    </div>
  );
};

export default CouponBox;

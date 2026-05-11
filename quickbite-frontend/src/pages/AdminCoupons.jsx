// src/pages/AdminCoupons.jsx

import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Admin.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discount: "",
    minOrderAmount: "",
    expiryDate: "",
    allowedPlan: "",
  });

  // -----------------------------------
  // FETCH ALL COUPONS
  // -----------------------------------
  const fetchCoupons = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await api.get("/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.log("Fetch coupon error:", err);
      alert("Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // -----------------------------------
  // CREATE COUPON
  // -----------------------------------
  const createCoupon = async () => {
    if (
      !form.code ||
      !form.discount ||
      !form.minOrderAmount ||
      !form.expiryDate
    ) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      await api.post(
        "/coupons/create",
        {
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          minOrderAmount: Number(form.minOrderAmount),
          expiryDate: form.expiryDate,
          allowedPlan: form.allowedPlan || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Coupon created successfully");

      setForm({
        code: "",
        discount: "",
        minOrderAmount: "",
        expiryDate: "",
        allowedPlan: "",
      });

      fetchCoupons();
    } catch (err) {
      console.log("Create coupon error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // DELETE COUPON
  // -----------------------------------
  const deleteCoupon = async (id) => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      await api.delete(`/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Coupon deleted successfully");
      fetchCoupons();
    } catch (err) {
      console.log("Delete coupon error:", err);
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🎟 Admin Coupon Management</h1>

      {/* -----------------------------------
          CREATE COUPON FORM
      ----------------------------------- */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Coupon Code (SAVE20)"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={(e) =>
            setForm({
              ...form,
              discount: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Minimum Order Amount"
          value={form.minOrderAmount}
          onChange={(e) =>
            setForm({
              ...form,
              minOrderAmount: e.target.value,
            })
          }
        />

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) =>
            setForm({
              ...form,
              expiryDate: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Allowed Plan (Optional)"
          value={form.allowedPlan}
          onChange={(e) =>
            setForm({
              ...form,
              allowedPlan: e.target.value,
            })
          }
        />

        <button
          onClick={createCoupon}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </div>

      <hr />

      {/* -----------------------------------
          COUPON LIST
      ----------------------------------- */}
      <h2>Existing Coupons</h2>

      {coupons.length === 0 ? (
        <p>No coupons created yet</p>
      ) : (
        <div className="plan-list">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="plan-card"
            >
              <h3>{coupon.code}</h3>

              <p>
                Discount: {coupon.discount}%
              </p>

              <p>
                Minimum Order: ₹
                {coupon.minOrderAmount}
              </p>

              <p>
                Expiry:{" "}
                {new Date(
                  coupon.expiryDate
                ).toLocaleDateString()}
              </p>

              <p>
                Status:{" "}
                {coupon.isActive
                  ? "Active"
                  : "Inactive"}
              </p>

              {coupon.allowedPlan && (
                <p>
                  Allowed Plan:{" "}
                  {coupon.allowedPlan}
                </p>
              )}

              <button
                className="delete-btn"
                onClick={() =>
                  deleteCoupon(coupon.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

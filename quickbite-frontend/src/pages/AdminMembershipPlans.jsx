import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Admin.css";

const AdminMembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 FORM TOGGLE STATE
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    benefits: "",
    duration: "",
    discountPercent: "",
    minOrderAmount: "",
  });

  const fetchPlans = async () => {
    try {
      const res = await api.get("/admin/membership-plans");
      setPlans(res.data.plans || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async () => {
    try {
      setLoading(true);

      await api.post("/admin/membership-plans", {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        discountPercent: Number(form.discountPercent),
        minOrderAmount: Number(form.minOrderAmount),
      });

      setForm({
        name: "",
        price: "",
        benefits: "",
        duration: "",
        discountPercent: "",
        minOrderAmount: "",
      });

      setShowForm(false); // 👈 close after submit
      fetchPlans();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id) => {
    await api.delete(`/admin/membership-plans/${id}`);
    fetchPlans();
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER + SIDE BUTTON */}
      <div className="admin-header">
        <h1>💎 Membership Plans</h1>

        <button
          className="create-toggle-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form ✖" : "➕ Create Plan"}
        </button>
      </div>

      {/* 🔽 DROPDOWN FORM (TOP TO BOTTOM ANIMATION) */}
      <div className={`form-wrapper ${showForm ? "open" : ""}`}>
        <div className="admin-form">

          <input placeholder="Plan Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input placeholder="Benefits"
            value={form.benefits}
            onChange={(e) =>
              setForm({ ...form, benefits: e.target.value })
            }
          />

          <input placeholder="Duration"
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          <input placeholder="Discount %"
            type="number"
            value={form.discountPercent}
            onChange={(e) =>
              setForm({ ...form, discountPercent: e.target.value })
            }
          />

          <input placeholder="Min Order"
            type="number"
            value={form.minOrderAmount}
            onChange={(e) =>
              setForm({ ...form, minOrderAmount: e.target.value })
            }
          />

          <button onClick={createPlan}>
            {loading ? "Creating..." : "Create Plan"}
          </button>

        </div>
      </div>

      {/* PLANS LIST */}
      <h2>Existing Plans</h2>

      <div className="plan-list">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.id}>
            <h3>{plan.name}</h3>
            <p>₹{plan.price}</p>
            <p>{plan.benefits}</p>

            <button
              className="delete-btn"
              onClick={() => deletePlan(plan.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminMembershipPlans;
// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try {
        const res = await api.get("/orders/user/me");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      }
    })();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.map(o => (
        <div key={o.id} style={{border:"1px solid #ddd", padding:8, margin:8}}>
          <div>Order #{o.id} — Status: {o.status}</div>
          <div>Restaurant: {o.restaurant?.name}</div>
          <div>Items:
            {o.items.map(it => <div key={it.id}>{it.menuItem?.name} x {it.quantity}</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

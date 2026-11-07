import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext, url } from "../../../Context/StoreContext";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${url}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load orders");
        setOrders(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <p className="my-orders-message">Please sign in to see your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <p className="my-orders-message">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <p className="my-orders-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <p className="my-orders-message">You have no orders yet.</p>
      )}

      <div className="my-orders-list">
        {orders.map((order) => (
          <div key={order._id} className="my-orders-card">
            <div className="my-orders-top">
              <p>
                <b>Order #{order._id.slice(-6).toUpperCase()}</b>
              </p>
              <span className="my-orders-status">{order.status}</span>
            </div>

            <p className="my-orders-date">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p className="my-orders-items">
              {order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}
            </p>

            <p className="my-orders-total">
              Total: <b>${order.totalPrice}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
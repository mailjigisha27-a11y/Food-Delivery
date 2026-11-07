import React, { useContext, useEffect, useState } from "react";
import "./Admin.css";
import { StoreContext, url } from "../../../Context/StoreContext";

const STATUSES = ["Pending", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

const emptyForm = { name: "", description: "", price: "", category: "Salad", image: "" };

const Admin = () => {
  const { token, user } = useContext(StoreContext);
  const isAdmin = Boolean(token && user && user.role === "admin");

  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Small helper that talks to the backend with the admin token
  const api = async (path, options = {}) => {
    const res = await fetch(`${url}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [orderData, foodData] = await Promise.all([
        api("/api/orders"),
        api("/api/food"),
      ]);
      setOrders(orderData);
      setFoods(foodData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAll();
    else setLoading(false);
  }, [isAdmin]);

  const changeStatus = async (orderId, status) => {
    try {
      setError("");
      setMessage("");
      const updated = await api(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      setMessage("Order status updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addDish = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      const price = Number(form.price);
      if (Number.isNaN(price) || price < 0) {
        throw new Error("Please enter a valid price");
      }
      await api("/api/food", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          category: form.category,
          image: form.image.trim(),
        }),
      });
      setForm(emptyForm);
      setMessage("Dish added.");
      const foodData = await api("/api/food");
      setFoods(foodData);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDish = async (food) => {
    if (!window.confirm(`Delete "${food.name}" from the menu?`)) return;
    try {
      setError("");
      setMessage("");
      await api(`/api/food/${food._id}`, { method: "DELETE" });
      setFoods((prev) => prev.filter((f) => f._id !== food._id));
      setMessage("Dish deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin">
        <h2>Admin</h2>
        <p className="admin-note">Admin access only. Please sign in with an admin account.</p>
      </div>
    );
  }

  return (
    <div className="admin">
      <h2>Admin</h2>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === "orders" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTab("orders")}
        >
          Orders ({orders.length})
        </button>
        <button
          type="button"
          className={tab === "dishes" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTab("dishes")}
        >
          Dishes ({foods.length})
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}
      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-note">Loading...</p>}

      {!loading && tab === "orders" && (
        <div className="admin-list">
          {orders.length === 0 && <p className="admin-note">No orders yet.</p>}
          {orders.map((order) => (
            <div key={order._id} className="admin-card">
              <div className="admin-card-top">
                <b>Order #{order._id.slice(-6).toUpperCase()}</b>
                <select
                  value={order.status}
                  onChange={(e) => changeStatus(order._id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="admin-small">{new Date(order.createdAt).toLocaleString()}</p>
              <p>
                {order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
              </p>
              <p className="admin-small">
                {order.customerName} · {order.phone}
              </p>
              <p className="admin-small">
                {[order.address, order.city, order.state, order.zipCode, order.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>
                Total: <b>${order.totalPrice}</b>
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "dishes" && (
        <>
          <form className="admin-form" onSubmit={addDish}>
            <h3>Add a new dish</h3>
            <input
              name="name"
              value={form.name}
              onChange={onFormChange}
              placeholder="Dish name"
              required
            />
            <input
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Short description"
            />
            <div className="admin-row">
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onFormChange}
                placeholder="Price"
                required
              />
              <select name="category" value={form.category} onChange={onFormChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="image"
              value={form.image}
              onChange={onFormChange}
              placeholder="Picture link (optional, starts with https://)"
            />
            <button type="submit">Add dish</button>
          </form>

          <div className="admin-list">
            {foods.map((food) => (
              <div key={food._id} className="admin-card admin-food">
                <div>
                  <b>{food.name}</b>
                  <p className="admin-small">
                    {food.category} · ${food.price}
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-delete"
                  onClick={() => deleteDish(food)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
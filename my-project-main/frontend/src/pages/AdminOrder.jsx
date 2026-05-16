import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrder.css";

function AdminOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="admin-container">
      {/* ✅ Sidebar (same as AdminMenu.jsx) */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => (window.location.href = "/admin/user")}>Users</li>
          <li onClick={() => (window.location.href = "/admin/menu")}>Menu</li>
          <li className="active">Orders</li>
          <li
            onClick={() => {
              localStorage.removeItem("adminAuth");
              window.location.href = "/";
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* ✅ Orders Content */}
      <div className="content">
        <h1>All Orders</h1>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.user?.name}</td>
                  <td>{order.user?.email}</td>
                  <td>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} × {item.quantity} — ₹
                        {item.price * item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrder;
 
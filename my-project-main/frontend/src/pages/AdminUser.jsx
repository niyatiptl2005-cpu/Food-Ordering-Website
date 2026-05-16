import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminUser.css";

function AdminUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/";
  };

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/all");

        // Check if data is valid
        if (res.data && res.data.users && Array.isArray(res.data.users)) {
          const usersWithIndex = res.data.users.map((u, i) => ({
            ...u,
            indexNumber: i + 1,
          }));
          setUsers(usersWithIndex);
          setFiltered(usersWithIndex);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim().toLowerCase();

    if (!term) {
      setFiltered(users);
      return;
    }

    const results = users.filter(
      (u) =>
        u.indexNumber.toString().includes(term) ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );

    setFiltered(results);
  };

  // ✅ Reset button
  const handleReset = () => {
    setSearch("");
    setFiltered(users);
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li className="active">Users</li>
          <li onClick={() => (window.location.href = "/admin/menu")}>Menu</li>
          <li onClick={() => (window.location.href = "/admin/orders")}>Orders</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <div className="content">
        <h1>Registered Users Report</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <span onClick={handleReset} className="reset-btn">
            Reset
          </span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.length > 0 ? (
              filtered.map((user) => (
                <tr key={user._id || user.email}>
                  <td>{user.indexNumber}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUser;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminMenu.css";

function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // track edit mode
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu/all");
      setMenu(res.data.items || []);
    } catch (err) {
      console.error("❌ Error fetching menu:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!newItem.name || !newItem.price || !imageFile) {
      setError("Please fill all fields including image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("image", imageFile);

      await axios.post("http://localhost:5000/api/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewItem({ name: "", price: "" });
      setImageFile(null);
      setError("");
      fetchMenu();
    } catch (err) {
      console.error("❌ Error adding item:", err);
      setError(err.response?.data?.message || "Failed to add item. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/delete/${id}`);
        fetchMenu();
      } catch (err) {
        console.error("❌ Error deleting item:", err);
      }
    }
  };

  // ✅ Edit item (prefill form)
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, price: item.price });
  };

  // ✅ Update existing item
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(
        `http://localhost:5000/api/menu/update/${editingItem._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditingItem(null);
      setNewItem({ name: "", price: "" });
      setImageFile(null);
      fetchMenu();
    } catch (err) {
      console.error("❌ Error updating item:", err);
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => (window.location.href = "/admin/user")}>Users</li>
          <li className="active">Menu</li>
          <li onClick={() => (window.location.href = "/admin/orders")}>Orders</li>
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

      <div className="content">
        <h1>{editingItem ? "Edit Menu Item" : "Manage Menu Items"}</h1>

        {error && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #ef5350"
          }}>
            {error}
          </div>
        )}

        <form
          className="add-item-form"
          onSubmit={editingItem ? handleUpdate : handleAdd}
        >
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price ₹"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <label htmlFor="fileUpload" className="upload-btn">
            {editingItem ? "Change Image" : "Choose Image"}
          </label>
          <span className="file-name">
            {imageFile ? imageFile.name : "No file chosen"}
          </span>

          <button type="submit">
            {editingItem ? "Update Item" : "Add Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setNewItem({ name: "", price: "" });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Image</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.length > 0 ? (
              menu.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      width="60"
                      height="60"
                    />
                  </td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMenu;

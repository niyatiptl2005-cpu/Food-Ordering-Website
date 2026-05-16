import React, { useEffect, useState } from "react";
import "./Menu.css";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Menu() {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);

  // Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu/all");
        setMenuItems(res.data.items || []);
      } catch (err) {
        console.error("❌ Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <section className="menu-section">
      <h2 className="menu-title">Our Menu</h2>
      <div className="menu-container">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div className="menu-card" key={item._id}>
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `http://localhost:5000${item.image}`
                }
                alt={item.name}
                className="menu-img"
              />
              <h3>{item.name}</h3>
              <p className="menu-price">₹{item.price}</p>
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No items available</p>
        )}
      </div>
    </section>
  );
}

export default Menu;

import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // prevent double submit
  const navigate = useNavigate();

  // 🧾 Handle checkout
  const handleCheckout = async () => {
    if (isPlacingOrder) return; // prevent multiple clicks
    setIsPlacingOrder(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        navigate("/login");
        setIsPlacingOrder(false);
        return;
      }

      const items = cart.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      console.log("🟢 Sending order:", { userId: user._id, items, totalAmount: total });

      const response = await axios.post("http://localhost:5000/api/orders", {
        userId: user._id,
        items,
        totalAmount: total,
      });

      console.log("✅ Server response:", response.data);

      // Check if order was successfully created
      if (response.status === 201 && response.data.message === "Order placed successfully") {
        // Clear cart before navigation
        clearCart();
        
        // Navigate to success page with order data
        navigate("/order-success", {
          state: {
            orderData: {
              order: response.data.order,
              items: items,
              totalAmount: total,
            },
          },
        });
      } else {
        // Navigate to error page if response is unexpected
        navigate("/order-error");
      }
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error.message);
      
      // Only navigate to error if it's not a validation error (400)
      if (error.response?.status !== 400) {
        navigate("/order-error");
      } else {
        // For validation errors, show message and stay on cart
        alert(error.response.data.message || "Please check your order details.");
        setIsPlacingOrder(false);
      }
    }
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">My Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-header">
              <div>Image</div>
              <div>Item</div>
              <div>Quantity</div>
              <div>Subtotal</div>
              <div>Remove</div>
            </div>

            {cart.map((item, index) => {
              const itemId = item.id || item._id;
              const itemPrice = Number(item.price);
              const subtotal = itemPrice * item.quantity;

              return (
                <div className="cart-row" key={index}>
                  <div className="cart-image">
                    <img
                      src={
                        item.img?.startsWith("http")
                          ? item.img
                          : `http://localhost:5000${item.img || item.image}`
                      }
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{itemPrice}</p>
                  </div>

                  <div className="cart-quantity">
                    <button
                      onClick={() => updateQuantity(itemId, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(itemId, +1)}>+</button>
                  </div>

                  <div className="cart-subtotal">₹{subtotal}</div>

                  <div className="cart-remove">
                    <button onClick={() => removeFromCart(itemId)}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          <hr />

          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Processing..." : "Pay"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

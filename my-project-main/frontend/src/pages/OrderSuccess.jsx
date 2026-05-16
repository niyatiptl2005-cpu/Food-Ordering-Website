import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData || null;

  useEffect(() => {
    // Auto-redirect to menu after 8 seconds
    const timer = setTimeout(() => {
      navigate("/menu");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order. We've received your order and will process it shortly.
        </p>
        
        {orderData && (
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order ID:</span>
              <span>{orderData.order?._id || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span>₹{orderData.totalAmount || 0}</span>
            </div>
            <div className="detail-row">
              <span>Items:</span>
              <span>{orderData.items?.length || 0} item(s)</span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className={`status-${orderData.order?.status?.toLowerCase() || "completed"}`}>
                {orderData.order?.status || "Completed"}
              </span>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={() => navigate("/menu")} className="btn-primary">
            Continue Shopping
          </button>
          <button onClick={() => navigate("/")} className="btn-secondary">
            Go to Home
          </button>
        </div>

        <p className="redirect-message">
          You will be redirected to the menu page in a few seconds...
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;


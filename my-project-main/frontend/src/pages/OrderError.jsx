import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderError.css";

function OrderError() {
  const navigate = useNavigate();

  return (
    <div className="order-error-page">
      <div className="error-container">
        <div className="error-icon">✕</div>
        <h1>Order Failed</h1>
        <p className="error-message">
          We're sorry, but there was an error processing your order. Please try again.
        </p>
        
        <div className="action-buttons">
          <button onClick={() => navigate("/cart")} className="btn-primary">
            Try Again
          </button>
          <button onClick={() => navigate("/menu")} className="btn-secondary">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderError;


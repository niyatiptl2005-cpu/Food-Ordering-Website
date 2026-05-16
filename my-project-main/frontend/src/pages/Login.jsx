import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          formData
        );

        if (response.data.success) {
          setSuccessMsg("Login successful!");
          console.log("User info:", response.data.user);

          // ✅ Store user details correctly in localStorage
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // ✅ Redirect to menu page after successful login
          setTimeout(() => navigate("/menu"), 1000);

          setFormData({ email: "", password: "" });
        } else {
          setErrors({ api: "Invalid login response" });
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
          setErrors({ api: error.response.data.message });
        } else {
          setErrors({ api: "Server not responding. Try again later." });
        }
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error">{errors.email}</small>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <small className="error">{errors.password}</small>
          )}

          <button type="submit">Log In</button>
        </form>

        {/* ✅ Display API error or success */}
        {errors.api && <p className="error">{errors.api}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <p>
          Not a member?{" "}
          <Link to="/register" className="signup-link">
            Signup Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

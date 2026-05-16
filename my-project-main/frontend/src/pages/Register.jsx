import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    }

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
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      if (response.data.success) {
        setSuccessMsg("Account created successfully! Redirecting to menu...");
        
        // Save credentials before clearing form
        const { email, password } = formData;
        setFormData({ name: "", email: "", password: "" });
        
        // Auto-login after registration and redirect to menu
        try {
          const loginResponse = await axios.post("http://localhost:5000/api/users/login", {
            email: email,
            password: password,
          });
          
          if (loginResponse.data.success) {
            localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
            setTimeout(() => navigate("/menu"), 1500);
          }
        } catch (loginError) {
          // If auto-login fails, just redirect to login page
          setTimeout(() => navigate("/login"), 1500);
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.data) {
        setErrors({ api: error.response.data.message });
      } else {
        setErrors({ api: "Server not responding. Try again later." });
      }
    }
  }
};


  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <small className="error">{errors.name}</small>}

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
          {errors.password && <small className="error">{errors.password}</small>}

          <button type="submit">Sign Up</button>
        </form>

        {errors.api && <p className="error">{errors.api}</p>}

        {successMsg && <p className="success">{successMsg}</p>}

        <p>
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
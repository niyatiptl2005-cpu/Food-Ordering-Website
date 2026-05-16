import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  // handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMsg("");
  const validationErrors = validateForm();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      setSuccessMsg(response.data.message || "Message sent successfully ✅");
      setFormData({ username: "", email: "", message: "" });
    } catch (error) {
      console.error("❌ Error sending contact:", error);
      setSuccessMsg("Error sending message. Please try again.");
    }
  }
};


  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <small className="error">{errors.username}</small>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error">{errors.email}</small>}

          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          {errors.message && <small className="error">{errors.message}</small>}

          <button type="submit">Send Message</button>
        </form>

        {successMsg && <p className="success">{successMsg}</p>}
      </div>
    </div>
  );
}

export default Contact;

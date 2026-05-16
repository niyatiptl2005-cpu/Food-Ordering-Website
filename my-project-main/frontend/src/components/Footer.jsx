import React from 'react';
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
    <div className="footer-column">
      <h3>CampusBite</h3>
      <p>&copy; 2025 CampusBite | All Rights Reserved</p>
    </div>

    <div className="footer-column">
      <h4>Contact Us</h4>
      <p>📞 +91 98765 43210</p>
      <p>📧 campusbite@gmail.com</p>
    </div>

    <div className="footer-column">
      <h4>Opening Hours</h4>
      <p>Mon - Fri: 9:00 AM - 9:00 PM</p>
      <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
    </div>
  </footer>
    
     
  );
}

export default Footer;
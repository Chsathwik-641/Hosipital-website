import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left-section">
        <div className="footer-info">
          <h2>Healing Touch Hospital</h2>
          <p>Providing compassionate healthcare with advanced technology.</p>
          <p>
            <strong>
              <img src="/location.png" alt="Location Icon" /> Address:
            </strong>{" "}
            123, Main Street, Hyderabad
          </p>
          <p>
            <strong>Phone:</strong> XXXXX-XXXXX
          </p>
          <p>&copy; 2025 Healing Touch Hospital. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="footer-right-section">
        <div className="footer-content">
          {/* Quick Links - Column Layout */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul className="footer-nav-links">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about_us">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/appointment">Appointment</NavLink>
              </li>
              <li>
                <NavLink to="/our_doctors">Our Doctors</NavLink>
              </li>
              <li>
                <NavLink to="/contact_us">Contact Us</NavLink>
              </li>
              <li>
                <NavLink to="/Feed_back"> Feed back</NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>
              <strong>📞 Phone:</strong> +91 xxxxxxxxxx
            </p>
            <p>
              <strong>✉️ Email:</strong> support@hthospital.com
            </p>
          </div>

          {/* Social Media */}
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#">
                <i className="bx bxl-instagram"></i>
              </a>
              <a href="#">
                <i className="bx bxl-facebook-circle"></i>
              </a>
              <a href="#">X</a>
              <a href="#">
                <i className="bx bxl-youtube"></i>
              </a>
              <a href="#">
                <i className="bx bxl-linkedin-square"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { NavLink } from "react-router-dom";
import "./FloatingButtons.css"; // Add styles here

const FloatingButtons = () => {
  return (
    <div className="floating-buttons">
      <NavLink to="/appointment" className="appointment-btn">
        Book appointment
      </NavLink>
      <button className="floating-call">
        <i class="bx bxs-phone-call"></i> XXX-XXXXXX
      </button>
      <a
        href="https://wa.me/Hospital_Number"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
      >
        <img src="/whatsapp.png" />
      </a>
    </div>
  );
};

export default FloatingButtons;

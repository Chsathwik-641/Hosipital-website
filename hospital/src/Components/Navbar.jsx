import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="logo">
        <a href="/">
          <img src="/logo.webp" alt="Logo" />
        </a>
      </div>
      <div className={`links ${isOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/about_us" onClick={() => setIsOpen(false)}>
          About Us
        </NavLink>
        <NavLink to="/appointment" onClick={() => setIsOpen(false)}>
          Appointment
        </NavLink>
        <NavLink to="/our_doctors" onClick={() => setIsOpen(false)}>
          Our Doctors
        </NavLink>
        <NavLink to="/enquiry" onClick={() => setIsOpen(false)}>
          Enquiry
        </NavLink>
        <NavLink to="/Feed_back" onClick={() => setIsOpen(false)}>
          Feed back
        </NavLink>
      </div>
      <div className="emergency">
        <div>
          <p>EMERGENCY</p>
          <button className="btn">
            <i className="bx bxs-ambulance"></i> xxxx
          </button>
        </div>
        <div>
          <p>Hospital Help-line</p>
          <button className="btn">
            <i className="bx bxs-phone"></i> xxxxx-xxxxx
          </button>
        </div>
        <i className="bx bx-menu-alt-right" id="menu" onClick={toggleMenu}></i>
      </div>
    </nav>
  );
};

export default Navbar;

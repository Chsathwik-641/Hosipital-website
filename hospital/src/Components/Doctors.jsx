import React, { useState, useEffect } from "react";
import "./Doctors.css";
import { NavLink } from "react-router-dom";
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setFilteredDoctors(data); // Initially show all doctors
      })
      .catch((error) => console.error("Error fetching doctors data", error));
  }, []);

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors); // Show all if search is empty
    } else {
      setFilteredDoctors(
        doctors.filter(
          (doc) =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredDoctors(doctors);
    }
  };

  return (
    <div className="doctors-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Our Doctors
      </div>
      <h2>Doctors List</h2>

      {/* Search Box and Button */}
      <div className="doctor-search">
        <input
          type="text"
          placeholder="Search by name or specialization like neurologist , cardiologist,etc..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          <i class="bx bx-search-alt-2"></i>
        </button>
      </div>

      {/* Doctors List */}
      <div className="doctors-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc.doctor_id} className="doctor-card">
              <div className="doctor-image">
                <img src="/doctor.webp" />
              </div>
              <div>
                <strong>Name:</strong> {doc.name}
              </div>
              <div>
                <strong>Specialty:</strong> {doc.specialization}
              </div>
              <div>
                <strong>Email:</strong> {doc.email}
              </div>
              <div className="home-btn">
                <NavLink to="/appointment">Book Appointment</NavLink>
              </div>
            </div>
          ))
        ) : (
          <p className="not-found">No doctors found 😔</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;

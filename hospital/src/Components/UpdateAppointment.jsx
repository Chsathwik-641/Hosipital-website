import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateAppointment.css";

const UpdateAppointment = ({ appointment, setSearchedAppointment }) => {
  const [searchData, setSearchData] = useState({
    name: "",
    email: "",
    appointment_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(appointment || {});
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearchAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/appointments/${searchData.appointment_id}`,
        { params: { name: searchData.name, email: searchData.email } }
      );

      if (!response.data) {
        alert("Appointment not found!");
        setSearchedAppointment(null);
        return;
      }
      setSearchedAppointment(response.data);
    } catch (error) {
      alert("Appointment not found!");
      setSearchedAppointment(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/appointments/${formData.appointment_id}`,
        {
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          doctor_id: formData.doctor_id,
          status: formData.status,
        }
      );
      setStatus("updated");
    } catch (error) {
      alert("Error updating appointment");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(
          `http://localhost:5000/appointments/${appointment.appointment_id}`
        );
        setStatus("deleted");
      } catch (error) {
        alert("Error deleting appointment");
      }
    }
  };

  return (
    <div>
      {status === "deleted" && (
        <div className="delete-success">
          <p>Your appointment has been deleted successfully!</p>
          <div className="home-link">
            <Link to="/">
              <p>Go to Home</p>
            </Link>
          </div>
        </div>
      )}

      {status === "updated" && (
        <div className="update-success">
          <p>Your appointment has been updated successfully!</p>
          <div className="home-link">
            <Link to="/">
              <p>Go to Home</p>
            </Link>
          </div>
        </div>
      )}

      {!appointment && status === "" && (
        <div className="search-container">
          <div className="Appo">
            <h2>Find Your Appointment</h2>
          </div>
          <form className="search-form" onSubmit={handleSearchAppointment}>
            <label htmlFor="name">
              Full Name<span className="required">*</span>:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={searchData.name}
              onChange={handleSearchInputChange}
              required
            />

            <label htmlFor="email">
              Email Address<span className="required">*</span>:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={searchData.email}
              onChange={handleSearchInputChange}
              required
            />

            <label htmlFor="appointment_id">
              Appointment ID<span className="required">*</span>:
            </label>
            <input
              type="text"
              id="appointment_id"
              name="appointment_id"
              placeholder="Enter your appointment ID"
              value={searchData.appointment_id}
              onChange={handleSearchInputChange}
              required
            />

            <div className="button-container">
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      )}

      {appointment && status === "" && (
        <div className="appointment-details">
          {!isEditing ? (
            <div>
              <h2 className="appointment-heading">Appointment Details</h2>
              <div className="appointment-paragraph">
                <p>
                  <strong>Appointment ID:</strong> {appointment.appointment_id}
                </p>
                <p>
                  <strong>Patient Name:</strong> {appointment.first_name}{" "}
                  {appointment.last_name}
                </p>
                <p>
                  <strong>Age:</strong> {appointment.age}
                </p>
                <p>
                  <strong>Contact:</strong> {appointment.contact_number}
                </p>
                <p>
                  <strong>Email:</strong> {appointment.email}
                </p>
                <p>
                  <strong>Medical Condition:</strong>{" "}
                  {appointment.medical_condition}
                </p>
                <p>
                  <strong>Doctor Name:</strong> {appointment.doctor_name}
                </p>
                <p>
                  <strong>Appointment Date:</strong>{" "}
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Appointment Time:</strong>{" "}
                  {appointment.appointment_time}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
              </div>
              <div className="button-container">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="appointment-edit">
              <div className="heading-edit">
                <h2>Edit Appointment</h2>
              </div>
              <div className="update-form">
                <form onSubmit={handleUpdate}>
                  <label htmlFor="appointment_date">
                    Appointment Date<span className="required">*</span>:{" "}
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    required
                  />

                  <label htmlFor="appointment_time">
                    Appointment Time<span className="required">*</span>:{" "}
                  </label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    min="09:00"
                    max="13:00"
                    required
                  />

                  <div className="button-container">
                    <button type="submit">Update</button>
                    <button
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateAppointment;

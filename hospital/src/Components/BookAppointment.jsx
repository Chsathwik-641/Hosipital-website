import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookAppointment.css";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [showDoctorList, setShowDoctorList] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    contact_number: "",
    email: "",
    medical_condition: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors data:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.length > 0) {
      setShowDoctorList(true);
      setFilteredDoctors(
        doctors.filter((doctor) => doctor.name.toLowerCase().includes(query))
      );
    } else {
      setShowDoctorList(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setFormData({ ...formData, doctor_id: doctor.doctor_id });
    setSelectedDoctor(doctor);
    setSearchQuery(doctor.name);
    setShowDoctorList(false);

    if (doctor.status === "on_leave" && formData.appointment_date === today) {
      setWarningMessage(
        `${doctor.name} is on leave today. Choose another date.`
      );
    } else {
      setWarningMessage("");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (
      e.target.name === "appointment_date" &&
      selectedDoctor?.status === "on_leave"
    ) {
      if (e.target.value === today) {
        setWarningMessage(
          `${selectedDoctor.name} is on leave today. Choose another date.`
        );
      } else {
        setWarningMessage("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      age: parseInt(formData.age),
      doctor_id: parseInt(formData.doctor_id),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/appointments",
        updatedFormData
      );

      if (response.data.appointment_id) {
        setAppointmentId(response.data.appointment_id);
        setShowModal(true);
      }

      setFormData({
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        contact_number: "",
        email: "",
        medical_condition: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
      });
      setSelectedDoctor(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      alert(
        error.response?.data?.error || "Failed to book appointment. Try again."
      );
    }
  };

  return (
    <div className="Book-container">
      <div className="BookAppointment">
        <h2>Book an Appointment</h2>
      </div>
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-pair">
            <label htmlFor="first_name">
              First Name<span className="required">*</span> :
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-pair">
            <label htmlFor="last_name">
              Last Name<span className="required">*</span> :
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-pair">
            <label htmlFor="age">
              Age<span className="required">*</span> :
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-pair">
            <label htmlFor="gender">
              Gender<span className="required">*</span> :
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="input-pair">
            <label htmlFor="contact_number">
              Contact Number<span className="required">*</span> :
            </label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-pair">
            <label htmlFor="email">
              Email<span className="required">*</span> :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="medical_condition">
            Medical Condition<span className="required">*</span> :
          </label>
          <textarea
            id="medical_condition"
            name="medical_condition"
            value={formData.medical_condition}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="doctor_search">
            Doctor Name<span className="required">*</span> :
          </label>
          <input
            type="text"
            id="doctor_search"
            name="doctor_search"
            value={searchQuery}
            onChange={handleSearchChange}
            required
          />
          {showDoctorList && filteredDoctors.length > 0 && (
            <ul className="doctor-list">
              {filteredDoctors.map((doctor) => (
                <li
                  key={doctor.doctor_id}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  {doctor.name} - {doctor.specialization} ({doctor.status})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <div className="input-pair">
            <label htmlFor="appointment_date">
              Appointment Date<span className="required">*</span> :
            </label>
            <input
              type="date"
              id="appointment_date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-pair">
            <label htmlFor="appointment_time">
              Appointment Time<span className="required">*</span> :
            </label>
            <input
              type="time"
              id="appointment_time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleInputChange}
              required
              min="09:00"
              max="13:00"
            />
          </div>
        </div>

        {warningMessage && <p className="warning-message">{warningMessage}</p>}

        <div className="button-container">
          <button
            type="submit"
            disabled={
              selectedDoctor?.status === "on_leave" &&
              formData.appointment_date === today
            }
          >
            Book Appointment
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Appointment Booked Successfully!</h3>
            <p>
              Please note your appointment ID: <strong>{appointmentId}</strong>
            </p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;

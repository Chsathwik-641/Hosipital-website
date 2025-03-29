import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Feedback.css";
import FloatingButtons from "./FloatingButtons";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    department: "",
    appointment_experience: "",
    billing_experience: "",
    comments: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const {
      name,
      contact,
      email,
      department,
      appointment_experience,
      billing_experience,
      comments,
    } = formData;

    if (
      !name ||
      !contact ||
      !email ||
      !department ||
      !appointment_experience ||
      !billing_experience ||
      !comments
    ) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      setError("Invalid contact number (must be 10 digits)");
      return false;
    }

    if (
      appointment_experience < 1 ||
      appointment_experience > 5 ||
      billing_experience < 1 ||
      billing_experience > 5
    ) {
      setError("Experience ratings must be between 1 and 5");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/feedback", formData);
      setMessage(res.data.message);
      setFormData({
        name: "",
        contact: "",
        email: "",
        department: "",
        appointment_experience: "",
        billing_experience: "",
        comments: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="feedback-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Feedback
      </div>
      <div className="enquiry-heading">
        <h2>Feedback Form</h2>
        <p>
          We strive to improve the quality of care and value the suggestions of
          our customers. Provide your valuable feedback to improve our services.
        </p>
      </div>

      {error && <p className="feedback-error">{error}</p>}
      {message && <p className="feedback-message">{message}</p>}

      <form onSubmit={handleSubmit} className="feedback-form">
        <label htmlFor="name">
          Name<span className="required">*</span> :{" "}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="feedback-input"
        />
        <label htmlFor="contact">
          Contact<span className="required">*</span> :{" "}
        </label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="feedback-input"
        />
        <label htmlFor="email">
          Email<span className="required">*</span> :{" "}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="feedback-input"
        />
        <label htmlFor="department">
          Department<span className="required">*</span> :{" "}
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="General Medicine">General Medicine</option>
        </select>
        <label htmlFor="appointment_experience">
          Appointment Experience<span className="required">*</span> :{" "}
        </label>
        <input
          type="number"
          name="appointment_experience"
          placeholder="Appointment Experience (1-5)"
          value={formData.appointment_experience}
          onChange={handleChange}
          className="feedback-input"
        />
        <label htmlFor="billing_experience">
          Billing Experience<span className="required">*</span>:{" "}
        </label>
        <input
          type="number"
          name="billing_experience"
          placeholder="Billing Experience (1-5)"
          value={formData.billing_experience}
          onChange={handleChange}
          className="feedback-input"
        />
        <label htmlFor="comments">
          Feedback<span className="required">*</span>:{" "}
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="feedback-input"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>
      <FloatingButtons />
    </div>
  );
};

export default FeedbackForm;

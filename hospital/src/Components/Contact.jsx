import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Enquiry.css";
import FloatingButtons from "./FloatingButtons";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [checkboxWarning, setCheckboxWarning] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsAgreed(e.target.checked);
    setCheckboxWarning("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setSuccessMessage("");
    setErrorMsg("");

    if (!isAgreed) {
      setCheckboxWarning("⚠️ You must agree to the Terms & Conditions.");
      setIsSubmit(false);
      return;
    }

    axios
      .post("http://localhost:5000/enquiry", formData)
      .then((response) => {
        setSuccessMessage("✅ Enquiry submitted successfully!");
        setFormData({ name: "", email: "", phone_number: "", message: "" });
        setIsAgreed(false);
      })
      .catch((error) => {
        setErrorMsg(error.response?.data?.error || "Something went wrong.");
      })
      .finally(() => {
        setIsSubmit(false);
      });
    console.log(formData);
  };

  return (
    <div className="enquiry-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Enquiry
      </div>

      <div className="enquiry-heading">
        <h2>Enquiry Form</h2>
        <p>
          With state-of-the-art facilities and a team of experienced healthcare
          professionals, HT Hospital is dedicated to delivering comprehensive
          and compassionate care to patients. Fill in the below details to
          enquire about treatment, services, and facilities available.
        </p>
      </div>

      <div className="enquiry-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name<span className="required">*</span> :{" "}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">
            Email<span className="required">*</span> :{" "}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="phone_number">
            Contact<span className="required">*</span> :{" "}
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <label>
            Enquiry<span className="required">*</span> :{" "}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <div className="enquiry-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={isAgreed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms"> I agree to the Terms & Conditions</label>
          </div>
          {checkboxWarning && (
            <p className="warning-message">{checkboxWarning}</p>
          )}{" "}
          <p>
            * By submitting this form, you consent to receive communication from
            HT Hospital via call, WhatsApp, email, and SMS.
          </p>
          <button type="submit" disabled={isSubmit}>
            {isSubmit ? "Submitting..." : "Submit"}
          </button>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errorMsg && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
      <FloatingButtons />
    </div>
  );
};

export default Contact;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import { NavLink } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";

const HospitalPortal = () => {
  const images = [
    "/hospital.jpg",
    "/reception.jpg",
    "/mri.jpg",
    "/emergency.jpg",
    "/icu.jpg",
    "/doctorinteract.jpg",
    "/staff.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [consultBooked, setConsultBooked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    doctor: "",
  });
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Do I need an appointment for emergency care?",
      answer:
        "No, emergency cases are treated immediately. You can walk in anytime.",
    },
    {
      question: "How do I book an appointment with a specialist?",
      answer:
        "You can book an appointment online through our portal or call our reception.",
    },
    {
      question: "What insurance providers do you accept?",
      answer:
        "We accept all major insurance providers. Contact us for specific details.",
    },
    {
      question: "Do you offer online consultations?",
      answer:
        "Yes, we provide video consultations with specialists. You can book online.",
    },
    {
      question: "What are the visiting hours?",
      answer:
        "Visiting hours are from 10 AM to 1 PM. Emergency cases are allowed anytime.",
    },
    {
      question: "Are walk-in consultations available?",
      answer:
        "Yes, walk-in consultations are available, but booking in advance is recommended.",
    },

    {
      question: "What safety measures are in place for COVID-19?",
      answer:
        "We follow strict sanitization, social distancing, and mask-wearing protocols.",
    },
    {
      question: "Is there a pharmacy available in the hospital?",
      answer: "Yes, we have a 24/7 in-house pharmacy for your convenience.",
    },
    {
      question: "Do you have ambulance services?",
      answer: "Yes, our ambulance services are available 24/7 for emergencies.",
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can reschedule or cancel your appointment through our online portal or by calling us.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch available doctors
  useEffect(() => {
    axios
      .get("http://localhost:5000/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  const toggleConsultForm = () => {
    setShowConsultForm(true);
    setConsultBooked(false);
  };
  const closeConsultForm = () => setShowConsultForm(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/book-consultation", formData)
      .then(() => {
        setConsultBooked(true);
        setTimeout(() => setShowConsultForm(false), 5000);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {/* Home Welcome Section */}
      <div className="home-welcome">
        <h1>Welcome to HT Hospital</h1>
        <p>
          We provide world-class healthcare with cutting-edge technology and
          compassionate care. Our dedicated team of doctors is available 24/7.
        </p>
      </div>

      {/* Image Slider */}
      <div className="image-slider">
        <div className="image-container">
          <img
            src={images[currentImage]}
            alt="hospital"
            className="slider-image"
          />
          <div className="dots-container">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImage ? "active" : ""}`}
                onClick={() => goToImage(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Sections */}
      <div className="home-container">
        <div className="grid">
          <div className="box">
            <img src="/our_doctor.jpg" />
            <div className="doc-info">
              <div className="box-p">
                <strong>
                  <p>Our Doctors</p>
                </strong>
                <p>Search by name and specialty.</p>
              </div>
              <div className="home-btn">
                <NavLink to="/our_doctors">Find a doctor</NavLink>
              </div>
            </div>
          </div>
          <div className="box">
            <img src="/appointments-card.jpg" />
            <div className="doc-info">
              <div className="box-p">
                <strong>
                  <p>Appointments</p>
                </strong>
                <p> Schedule an appointment for today.</p>
              </div>
              <div className="home-btn">
                <NavLink to="/appointment">Schedule now</NavLink>
              </div>
            </div>
          </div>
          <div className="box">
            <img src="/online_consult.webp" />
            <div className="doc-info">
              <div className="box-p">
                {" "}
                <strong>
                  {" "}
                  <p>Video consultation</p>
                </strong>
                <p>Schedule an online consultation</p>
              </div>
              <button onClick={toggleConsultForm} className="home-btn">
                Book now
              </button>
            </div>
          </div>
        </div>

        {/* Video Consultation Form (Popup) */}
        {showConsultForm && (
          <div className="popup">
            <button className="close-btn" onClick={closeConsultForm}>
              ❌
            </button>
            {!consultBooked ? (
              <form onSubmit={handleSubmit}>
                <h3>Book Video Consultation</h3>
                <label htmlFor="name">
                  Name<span className="required">*</span> :{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  onChange={handleFormChange}
                />
                <label htmlFor="phone">
                  Contact<span className="required">*</span> :{" "}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  onChange={handleFormChange}
                />
                <label htmlFor="email">
                  Email<span className="required">*</span> :{" "}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  onChange={handleFormChange}
                />

                <label htmlFor="doctor">
                  Select Doctor<span className="required">*</span> :{" "}
                </label>
                {/* Doctor Selection Dropdown */}
                <select name="doctor" required onChange={handleFormChange}>
                  <option value="">Select a Doctor</option>
                  {doctors.map((doc, index) => (
                    <option key={index} value={doc.name}>
                      {doc.name}
                    </option>
                  ))}
                </select>

                <button type="submit">Book Consultation</button>
              </form>
            ) : (
              <div className="confirmation">
                ✅ Your online consultation is booked!
              </div>
            )}
          </div>
        )}
        <section className="specialties">
          <h2>Our Specialties</h2>
          <div className="specialty-grid">
            <div className="specialty-card">
              <img src="/cardiology.webp" alt="Cardiology" />
              <h3>Cardiology</h3>
              <p>Advanced heart care treatments.</p>
            </div>
            <div className="specialty-card">
              <img src="/neurology.webp" alt="Neurology" />
              <h3>Neurology</h3>
              <p>Brain and nerve disorder specialists.</p>
            </div>
            <div className="specialty-card">
              <img src="/orthopedics.jpg" alt="Orthopedics" />
              <h3>Orthopedics</h3>
              <p>Bone and joint care by experts.</p>
            </div>
            <div className="specialty-card">
              <img src="/pulmonology.jpg" alt="Pulmonology" />
              <h3>Pulmonology</h3>
              <p>Lung health and respiratory care.</p>
            </div>
          </div>
        </section>
        <section className="testimonials">
          <h2>Patients Speak</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>"The doctors were extremely professional and caring."</p>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <h4>- Rajesh Kumar</h4>
            </div>
            <div className="testimonial-card">
              <p>"Best medical facility I've ever visited!"</p>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <h4>- Priya Sharma</h4>
            </div>
            <div className="testimonial-card">
              <p>"The treatment I received was top-notch."</p>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <h4>- Arvind Mehta</h4>
            </div>
            <div className="testimonial-card">
              <p>"Exceptional service and modern facilities!"</p>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <h4>-Sangeeta Reddy</h4>
            </div>
          </div>
        </section>
        <section className="faqs">
          <h1>Frequently Asked Questions</h1>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                  <span
                    className={`arrow ${openIndex === index ? "open" : ""}`}
                  >
                    &#9662;
                  </span>
                </div>
                {openIndex === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <FloatingButtons />
    </div>
  );
};

export default HospitalPortal;

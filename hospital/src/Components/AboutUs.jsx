import React from "react";
import "./AboutUs.css";
import { NavLink } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";

const AboutUs = () => {
  const images = [
    { src: "/operation_theater.jpg", caption: "Modern Operation Theater" },
    { src: "/emergency.jpg", caption: "24/7 Emergency & Trauma Care" },
    { src: "/mri.jpg", caption: "Advanced Imaging & Diagnostics" },
    { src: "/icu.jpg", caption: "Specialized Intensive Care Unit" },
    { src: "/patient_room.jpg", caption: "Private & Deluxe Patient Rooms" },
  ];
  return (
    <div>
      <div className="aboutus">About Us</div>

      <div className="about-container">
        <div className="aboutus-home">
          <NavLink to="/">
            <i class="bx bxs-home-alt-2"></i>
          </NavLink>{" "}
          | About Us
        </div>
        <div className="overview">
          <div className="overview-content">
            <h3 className="content-heading">Overview</h3>
            <p>
              Healing Touch Hospital is a premier multi-specialty healthcare
              institution dedicated to providing world-class medical services
              with a patient-centered approach. Established in 1998, we have
              grown into a 500-bed advanced medical facility, serving thousands
              of patients every year with cutting-edge treatments and
              compassionate care.
            </p>
            <p>
              Our hospital is equipped with state-of-the-art medical technology,
              a highly skilled team of over 200 doctors, and specialized
              departments covering cardiology, neurology, orthopedics,
              pediatrics, and more. We offer 24/7 emergency care, advanced
              diagnostic services, modern operation theaters, and specialized
              intensive care units (ICUs).
            </p>
            <p>
              Beyond treatment, we focus on preventive healthcare, community
              outreach programs, and medical research to enhance the well-being
              of our patients and the society we serve. Our commitment to
              excellence has earned us multiple national and international
              healthcare awards for quality, safety, and innovation.
            </p>
          </div>
          <div className="overview-image">
            <img src="/hospital1.webp" alt="About Us" />
          </div>
        </div>
        <div className="values-container">
          <h3 className="content-heading">Our Values</h3>
          <ul className="values-list">
            <li>
              <strong>Compassion :</strong> Treating every patient with dignity,
              empathy, and respect.
            </li>
            <li>
              <strong>Integrity:</strong> Upholding the highest ethical
              standards in medical practice.
            </li>
            <li>
              <strong>Innovation:</strong> Continuously improving healthcare
              through research and technology.
            </li>
            <li>
              <strong>Excellence:</strong> Striving for the best possible
              patient outcomes.
            </li>
            <li>
              <strong>Community Commitment:</strong> Promoting wellness through
              outreach programs and health education.
            </li>
          </ul>
        </div>
        <div className="facilities-container">
          <h3 className="content-heading">Facilities & Technology</h3>
          <div className="facilities-images">
            {images.map((image, index) => (
              <div key={index} className="facility">
                <img src={image.src} alt={image.caption} />
                <p>{image.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="patient_container">
          <h3 className="content-heading">Patient Care & Safety</h3>
          <ul className="values-list">
            <li>
              <strong>Infection Control & Sterilization -</strong> Strict
              hygiene protocols, regular sanitization, and advanced air
              purification systems to prevent infections.
            </li>
            <li>
              {" "}
              <strong>24/7 Patient Monitoring -</strong> Continuous monitoring
              of critical patients with AI-assisted alerts for emergencies.
            </li>
            <li>
              {" "}
              <strong>Electronic Health Records (EHR)-</strong> Secure digital
              records for efficient and safe access to medical history.
            </li>
            <li>
              <strong>Fall Prevention Systems -</strong> Automated bed sensors
              and anti-slip flooring to reduce fall risks for elderly and
              critical patients.
            </li>
            <li>
              <strong>Pharmacy & Medication Safety -</strong> Digital
              prescription tracking, barcoded medication administration, and
              AI-driven drug interaction checks.
            </li>
            <li>
              {" "}
              <strong>Emergency Response Teams - </strong>Specialized teams for
              cardiac arrest, stroke, and trauma care with rapid intervention.
            </li>
            <li>
              {" "}
              <strong>Safe Blood Bank & Transfusion Services - </strong>
              WHO-standard blood screening with temperature-controlled storage.
            </li>
          </ul>
        </div>
        <div className="awards_container">
          <h3 className="content-heading">Awards & Accreditations</h3>
          <ul className="values-list">
            <li>
              🏆<strong> Best Multi-Specialty Hospital -</strong> National
              Healthcare Excellence Awards (2002)
            </li>
            <li>
              🏆 <strong>Top 10 Hospitals for Advanced Cardiac Care -</strong>{" "}
              Global Medical Association (2008)
            </li>
            <li>
              🏆 <strong>Gold Standard in Patient Safety & Hygiene - </strong>
              International Healthcare Council (2015)
            </li>
            <li>
              🏆 <strong>Excellence in Robotic Surgery Innovation - </strong>
              World Medical Innovations Summit (2023)
            </li>
            <li>
              🏆
              <strong>Leader in Emergency & Trauma Response -</strong>{" "}
              International Medical Safety Forum (2022)
            </li>
          </ul>
        </div>
      </div>
      <FloatingButtons />
    </div>
  );
};

export default AboutUs;

import React, { useContext, useState, useEffect, useRef } from "react";
import BookAppointment from "./BookAppointment";
import UpdateAppointment from "./UpdateAppointment";
import "./Appointment.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Appointments = () => {
  const [searchedAppointment, setSearchedAppointment] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const alertPops = useRef(false);
  useEffect(() => {
    if (!user && !alertPops.current) {
      alert("You must be logged in to book/search an appointment.");
      alertPops.current = true;
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="Appointment-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Appointment Schedule
      </div>

      {!searchedAppointment ? (
        <div className="forms-container fade-in">
          <div className="book-appointment">
            <BookAppointment />
          </div>

          <div className="update-appointment">
            <UpdateAppointment
              setSearchedAppointment={setSearchedAppointment}
            />
          </div>
        </div>
      ) : (
        <div className="appointment-details fade-in">
          <UpdateAppointment
            appointment={searchedAppointment}
            setSearchedAppointment={setSearchedAppointment}
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;

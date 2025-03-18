import React, { useState } from "react";
import BookAppointment from "./BookAppointment";
import UpdateAppointment from "./UpdateAppointment";
import "./Appointment.css";
import { NavLink } from "react-router-dom";

const Appointments = () => {
  const [searchedAppointment, setSearchedAppointment] = useState(null);

  return (
    <div className="Appointment-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Appointment Schedule
      </div>
      {/* <div className="op">
        <p>OP timings is from 9:00am to 1:00pm</p>
      </div> */}
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

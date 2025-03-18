const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

// Database Connection using Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test API Route
app.get("/", (req, res) => res.json({ message: "Backend connected!" }));

// Fetch Doctors List
app.get("/doctors", (req, res) => {
  pool.query("SELECT * FROM doctors", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Fetch Appointments
app.get("/appointments/:id", (req, res) => {
  const appointmentId = req.params.id;
  const query = `
    SELECT a.*, 
           p.first_name, p.last_name, p.age, p.gender, p.contact_number, 
           p.email, p.medical_condition, 
           d.name AS doctor_name  -- Fetch doctor's name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id  -- Join with doctors table
    WHERE a.appointment_id = ?`;

  pool.query(query, [appointmentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(result[0]); // Return patient and doctor details with the appointment
  });
});

// ✅ Book Appointment (POST)
app.post("/appointments", (req, res) => {
  // 1️⃣ Extract request data
  const {
    first_name,
    last_name,
    age,
    gender,
    contact_number,
    email,
    medical_condition,
    doctor_id,
    appointment_date,
    appointment_time,
  } = req.body;

  // 2️⃣ Validate required fields
  if (
    !first_name ||
    !last_name ||
    !age ||
    !gender ||
    !contact_number ||
    !email ||
    !doctor_id ||
    !appointment_date ||
    !appointment_time ||
    !medical_condition
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 3️⃣ Check if doctor has reached the appointment limit
  const checkLimitQuery =
    "SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND appointment_date = ?";
  pool.query(checkLimitQuery, [doctor_id, appointment_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result[0].count >= 35) {
      return res
        .status(400)
        .json({ error: "Doctor is fully booked for the day." });
    }

    // 4️⃣ Check if the appointment time is already taken
    const checkExistingQuery =
      "SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?";
    pool.query(
      checkExistingQuery,
      [doctor_id, appointment_date, appointment_time],
      (err, existingAppt) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existingAppt.length > 0) {
          return res
            .status(400)
            .json({ error: "This time slot is already booked." });
        }

        // 5️⃣ Insert the patient into the database
        const insertPatientQuery =
          "INSERT INTO patients (first_name, last_name, age, gender, contact_number, email, medical_condition, assigned_doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const patientParams = [
          first_name,
          last_name,
          age,
          gender,
          contact_number,
          email,
          medical_condition,
          doctor_id,
        ];

        pool.query(insertPatientQuery, patientParams, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const patient_id = result.insertId; // 🔹 Get patient ID from insert
          insertAppointment(patient_id); // 🔹 Call function to insert appointment
        });
      }
    );
  });

  // 6️⃣ Function to insert appointment
  function insertAppointment(patient_id) {
    const insertAppointmentQuery =
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, medical_condition) VALUES (?, ?, ?, ?, ?)";
    const params = [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      medical_condition,
    ];

    pool.query(insertAppointmentQuery, params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const appointment_id = result.insertId; // 🔹 Get appointment ID from insert

      res.json({
        message: "Appointment booked successfully!",
        appointment_id, // 🔹 Send appointment ID to frontend
        patient: {
          patient_id,
          first_name,
          last_name,
          age,
          gender,
          contact_number,
          email,
          medical_condition,
          assigned_doctor_id: doctor_id,
        },
      });
    });
  }
});

// ✅ Update Appointment (PUT)
app.put("/appointments/:id", (req, res) => {
  const appointmentId = req.params.id;
  console.log("🔹 Updating Appointment ID:", appointmentId);
  console.log("🔹 Received Update Data:", req.body); // ✅ Debugging step

  const { appointment_date, appointment_time, doctor_id, medical_condition } =
    req.body;

  // ✅ Check for Missing Fields
  if (!appointment_date || !appointment_time || !doctor_id) {
    console.error("❌ Missing Fields:", {
      appointment_date,
      appointment_time,
      doctor_id,
    });
    return res
      .status(400)
      .json({ error: "All fields are required for update" });
  }

  const query =
    "UPDATE appointments SET doctor_id = ?, appointment_date = ?, appointment_time = ?, medical_condition = ? WHERE appointment_id = ?";
  const params = [
    doctor_id,
    appointment_date,
    appointment_time,
    medical_condition,
    appointmentId,
  ];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error("❌ Error Updating Appointment:", err.message);
      return res
        .status(500)
        .json({ error: "Database error while updating appointment" });
    }
    res.json({ message: "Appointment updated successfully!" });
  });
});

// ✅ Delete Appointment (DELETE)
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id))
    return res.status(400).json({ error: "Valid appointment ID is required" });

  // 🔹 Get patient_id before deleting the appointment
  const getPatientQuery =
    "SELECT patient_id FROM appointments WHERE appointment_id = ?";

  pool.query(getPatientQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Appointment not found" });

    const patientId = result[0].patient_id;

    // 🔹 Delete the appointment
    pool.query(
      "DELETE FROM appointments WHERE appointment_id = ?",
      [id],
      (err, deleteResult) => {
        if (err) return res.status(500).json({ error: err.message });

        // 🔹 Check if patient still has any appointments
        pool.query(
          "SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ?",
          [patientId],
          (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            if (countResult[0].count === 0) {
              // 🔹 Delete patient if no more appointments exist
              pool.query(
                "DELETE FROM patients WHERE patient_id = ?",
                [patientId],
                (err) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({
                    message: "Appointment and patient deleted successfully!",
                  });
                }
              );
            } else {
              res.json({ message: "Appointment deleted successfully!" });
            }
          }
        );
      }
    );
  });
});

app.post("/book-consultation", (req, res) => {
  const { name, phone, email, doctor } = req.body;
  const query =
    "INSERT INTO video_consultations (name, phone, email, doctor) VALUES (?, ?, ?, ?)";

  pool.query(query, [name, phone, email, doctor], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Consultation booked successfully!" });
  });
});

app.post("/enquiry", (req, res) => {
  const { name, email, phone_number, message } = req.body;

  if (!name || !email || !phone_number || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql =
    "insert into enquiries(name, email, phone_number, message) values(?, ?, ?, ?)";
  pool.query(sql, [name, email, phone_number, message], (err, result) => {
    if (err) {
      console.error("Error inserting enquiry:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Enquiry submitted successfully!" });
  });
});

app.post("/feedback", (req, res) => {
  const {
    name,
    contact,
    email,
    department,
    appointment_experience,
    billing_experience,
    comments,
  } = req.body;
  console.log(
    name,
    contact,
    email,
    department,
    appointment_experience,
    billing_experience,
    comments
  );

  if (
    !name ||
    !contact ||
    !email ||
    !department ||
    !appointment_experience ||
    !billing_experience ||
    !comments
  ) {
    return res.status(422).json({ error: "All fields are required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  const contactRegex = /^[0-9]{10}$/;
  if (!contactRegex.test(contact)) {
    return res.status(400).json({ error: "Invalid contact number" });
  }
  if (
    isNaN(appointment_experience) ||
    appointment_experience < 1 ||
    appointment_experience > 5 ||
    isNaN(billing_experience) ||
    billing_experience < 1 ||
    billing_experience > 5
  ) {
    return res
      .status(400)
      .json({ error: "Experience ratings must be between 1-5" });
  }
  const sql =
    "insert into feedback(name, contact, email, department, appointment_experience,billing_experience,comments) values (?,?,?,?,?,?,?)";
  pool.query(
    sql,
    [
      name,
      contact,
      email,
      department,
      appointment_experience,
      billing_experience,
      comments,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting enquiry:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "feedback submitted successfully!" });
    }
  );
});
// Scheduled Cron Job to Update Doctor Statuses
cron.schedule("*/10 * * * *", () => {
  console.log("Running scheduled job...");
  updateDoctorStatuses();
});

function updateDoctorStatuses() {
  const query = `
    UPDATE doctors d
    JOIN doctor_availability da ON d.doctor_id = da.doctor_id
    SET d.status = 
      CASE 
        WHEN da.day_of_week = DAYNAME(CURDATE()) AND da.status = 'on_leave' THEN 'on_leave'
        WHEN (SELECT COUNT(*) FROM appointments a WHERE a.doctor_id = d.doctor_id AND a.appointment_date = CURDATE()) >= 35 THEN 'busy'
        ELSE 'available'
      END
    WHERE da.day_of_week = DAYNAME(CURDATE());
  `;
  pool.query(query, (err) => {
    if (err) console.error("Error updating doctor statuses:", err);
    else console.log("Doctor statuses updated successfully!");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

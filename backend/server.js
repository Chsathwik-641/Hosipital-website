const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cron = require("node-cron");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital Management System!");
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    pool.query(
      "select * from users where email = ?",
      [email],
      (err, results) => {
        if (err) return done(err);
        if (results.length === 0)
          return done(null, false, { message: "no user found" });
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          return done(null, false, { message: "Incorrect password" });
        });
      }
    );
  })
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.user_id);
});

passport.deserializeUser((user_id, done) => {
  console.log("Deserializing user with user_id:", user_id);
  pool.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return done(err);
      if (!results.length) return done(null, false);
      return done(null, results[0]);
    }
  );
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized: please log in" });
}

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Database Select Error:", err);
          return res.status(500).json({ message: "Database Error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Database Insert Error:", err);
              return res.status(500).json({ message: "Database Error" });
            }

            console.log("User registered successfully, please login", results);
            return res
              .status(201)
              .json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.json({ message: "Logout successful" });
  });
});

app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});
app.get("/doctors", (req, res) => {
  pool.query("SELECT * FROM doctors", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
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
    res.json(result[0]);
  });
});
app.post("/appointments", ensureAuthenticated, (req, res) => {
  console.log("🔍 Checking req.user:", req.user);
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
  const checkLimitQuery =
    "SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND appointment_date = ?";
  pool.query(checkLimitQuery, [doctor_id, appointment_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result[0].count >= 35) {
      return res
        .status(400)
        .json({ error: "Doctor is fully booked for the day." });
    }
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

          const patient_id = result.insertId;
          insertAppointment(patient_id);
        });
      }
    );
  });
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

      const appointment_id = result.insertId;

      res.json({
        message: "Appointment booked successfully!",
        appointment_id,
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

app.put("/appointments/:id", ensureAuthenticated, (req, res) => {
  const appointmentId = req.params.id;
  const { appointment_date, appointment_time, doctor_id, medical_condition } =
    req.body;
  if (!appointment_date || !appointment_time || !doctor_id) {
    console.error(" Missing Fields:", {
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
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id))
    return res.status(400).json({ error: "Valid appointment ID is required" });
  const getPatientQuery =
    "SELECT patient_id FROM appointments WHERE appointment_id = ?";

  pool.query(getPatientQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Appointment not found" });
    const patientId = result[0].patient_id;
    pool.query(
      "DELETE FROM appointments WHERE appointment_id = ?",
      [id],
      (err, deleteResult) => {
        if (err) return res.status(500).json({ error: err.message });
        pool.query(
          "SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ?",
          [patientId],
          (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            if (countResult[0].count === 0) {
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

app.post("/book-consultation", ensureAuthenticated, (req, res) => {
  const { name, phone, email, doctor } = req.body;
  const query =
    "INSERT INTO video_consultations (name, phone, email, doctor) VALUES (?, ?, ?, ?)";

  pool.query(query, [name, phone, email, doctor], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Consultation booked successfully!" });
  });
});

app.post("/enquiry", ensureAuthenticated, (req, res) => {
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

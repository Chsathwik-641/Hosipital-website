create database if not exists hospital_db;
use hospital_db;
CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100) NOT NULL,
    status ENUM('available', 'on_leave', 'busy') DEFAULT 'available'
);
INSERT INTO doctors (name, email, phone, specialization, status) VALUES
('Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '9876543210', 'Neurologist', 'available'),
('Dr. Ananya Reddy', 'ananya.reddy@example.com', '9823456789', 'Orthopedist', 'available'),
('Dr. Karthik Menon', 'karthik.menon@example.com', '9934567890', 'Orthopedist', 'available'),
('Dr. Vinay Kumar', 'vinay.kumar@example.com', '9012345678', 'Radiologist', 'busy'),
('Dr. Sneha Kapoor', 'sneha.kapoor@example.com', '9801234567', 'General Physician', 'available'),
('Dr. Rahul Verma', 'rahul.verma@example.com', '9848122331', 'Neuro Surgeon', 'available'),
('Dr. Aditi Sharma', 'aditi.sharma@example.com', '9848122332', 'Cardiologist', 'available'),
('Dr. Sophia', 'sophia@example.com', '9848122333', 'Cardiologist', 'available');

DELETE FROM doctors WHERE doctor_id = 6;
select * from  doctors;

-- Modify existing table (if necessary)
DROP TABLE IF EXISTS doctor_availability;

CREATE TABLE doctor_availability (
    availability_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    session ENUM('morning') NOT NULL, 
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('available', 'on_leave', 'busy') DEFAULT 'available',
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- Insert doctor availability (only morning shifts from 9:00 AM to 1:00 PM)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, status) VALUES
-- Dr. Rajesh Sharma (Neurologist) - Off on Wednesday
(1, 'Monday', '09:00:00', '13:00:00', 'available'),
(1, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(1, 'Wednesday', '09:00:00', '13:00:00', 'on_leave'),
(1, 'Thursday', '09:00:00', '13:00:00', 'available'),
(1, 'Friday', '09:00:00', '13:00:00', 'available'),
(1, 'Saturday', '09:00:00', '13:00:00', 'available'),
(1, 'Sunday', '09:00:00', '13:00:00', 'available'),

-- Dr. Ananya Reddy (Orthopedist) - Off on Tuesday
(2, 'Monday', '09:00:00', '13:00:00', 'available'),
(2, 'Tuesday', '09:00:00', '13:00:00', 'on_leave'),
(2, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(2, 'Thursday', '09:00:00', '13:00:00', 'available'),
(2, 'Friday', '09:00:00', '13:00:00', 'available'),
(2, 'Saturday', '09:00:00', '13:00:00', 'available'),
(2, 'Sunday', '09:00:00', '13:00:00', 'available'),

-- Dr. Karthik Menon (Orthopedist) - Off on Thursday
(3, 'Monday', '09:00:00', '13:00:00', 'available'),
(3, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(3, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(3, 'Thursday', '09:00:00', '13:00:00', 'on_leave'),
(3, 'Friday', '09:00:00', '13:00:00', 'available'),
(3, 'Saturday', '09:00:00', '13:00:00', 'available'),
(3, 'Sunday', '09:00:00', '13:00:00', 'available'),

-- Dr. Vinay Kumar (Radiologist) - Always Busy
(4, 'Monday', '09:00:00', '13:00:00', 'available'),
(4, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(4, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(4, 'Thursday', '09:00:00', '13:00:00', 'available'),
(4, 'Friday', '09:00:00', '13:00:00', 'available'),
(4, 'Saturday', '09:00:00', '13:00:00', 'available'),
(4, 'Sunday', '09:00:00', '13:00:00', 'on_leave'),

-- Dr. Sneha Kapoor (General Physician) - Off on Sunday
(5, 'Monday', '09:00:00', '13:00:00', 'available'),
(5, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(5, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(5, 'Thursday', '09:00:00', '13:00:00', 'available'),
(5, 'Friday', '09:00:00', '13:00:00', 'available'),
(5, 'Saturday', '09:00:00', '13:00:00', 'available'),
(5, 'Sunday', '09:00:00', '13:00:00', 'on_leave'),

-- Dr. Rahul Verma (Neuro Surgeon) - Off on Saturday
(6, 'Monday', '09:00:00', '13:00:00', 'available'),
(6, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(6, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(6, 'Thursday', '09:00:00', '13:00:00', 'available'),
(6, 'Friday', '09:00:00', '13:00:00', 'available'),
(6, 'Saturday', '09:00:00', '13:00:00', 'on_leave'),
(6, 'Sunday', '09:00:00', '13:00:00', 'available'),

-- Dr. Aditi Sharma (Cardiologist) - Off on Monday
(7, 'Monday', '09:00:00', '13:00:00', 'on_leave'),
(7, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(7, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(7, 'Thursday', '09:00:00', '13:00:00', 'available'),
(7, 'Friday', '09:00:00', '13:00:00', 'available'),
(7, 'Saturday', '09:00:00', '13:00:00', 'available'),
(7, 'Sunday', '09:00:00', '13:00:00', 'available'),

-- Dr. Sophia (Cardiologist) - Off on Friday
(8, 'Monday', '09:00:00', '13:00:00', 'available'),
(8, 'Tuesday', '09:00:00', '13:00:00', 'available'),
(8, 'Wednesday', '09:00:00', '13:00:00', 'available'),
(8, 'Thursday', '09:00:00', '13:00:00', 'available'),
(8, 'Friday', '09:00:00', '13:00:00', 'on_leave'),
(8, 'Saturday', '09:00:00', '13:00:00', 'available'),
(8, 'Sunday', '09:00:00', '13:00:00', 'available');





select * from doctors;
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    medical_condition TEXT,
    assigned_doctor_id INT,
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctor_availability(doctor_id) ON DELETE SET NULL
);
 INSERT INTO patients (first_name, last_name, age, gender, contact_number, email, medical_condition, assigned_doctor_id) VALUES
-- Patients for Dr. Rajesh Sharma (Neurologist)
('Amit', 'Khanna', 45, 'Male', '9876543201', 'amit.khanna@example.com', 'Migraine and headache issues', 1),
('Pooja', 'Mehta', 32, 'Female', '9876543202', 'pooja.mehta@example.com', 'Mild epilepsy symptoms', 1),

-- Patients for Dr. Ananya Reddy (Orthopedist)
('Rakesh', 'Yadav', 50, 'Male', '9823456701', 'rakesh.yadav@example.com', 'Knee pain and arthritis', 2),
('Sonia', 'Kapoor', 28, 'Female', '9823456702', 'sonia.kapoor@example.com', 'Fractured wrist recovery', 2),

-- Patients for Dr. Karthik Menon (Orthopedist)
('Rohan', 'Malhotra', 35, 'Male', '9934567801', 'rohan.malhotra@example.com', 'Back pain due to prolonged sitting', 3),
('Neha', 'Agarwal', 41, 'Female', '9934567802', 'neha.agarwal@example.com', 'Shoulder stiffness', 3),

-- Patients for Dr. Vinay Kumar (Radiologist)
('Manoj', 'Tiwari', 55, 'Male', '9012345601', 'manoj.tiwari@example.com', 'Chest X-ray for pneumonia', 4),
('Ayesha', 'Khan', 29, 'Female', '9012345602', 'ayesha.khan@example.com', 'MRI scan for back injury', 4),

-- Patients for Dr. Sneha Kapoor (General Physician)
('Rahul', 'Sen', 26, 'Male', '9801234501', 'rahul.sen@example.com', 'General fever and weakness', 5),
('Swati', 'Deshmukh', 37, 'Female', '9801234502', 'swati.deshmukh@example.com', 'Routine health check-up', 5),

-- Patients for Dr. Rahul Verma (Neuro Surgeon)
('Nitin', 'Bansal', 48, 'Male', '9848122301', 'nitin.bansal@example.com', 'Spinal surgery consultation', 6),
('Kavita', 'Iyer', 53, 'Female', '9848122302', 'kavita.iyer@example.com', 'Brain tumor follow-up', 6),

-- Patients for Dr. Aditi Sharma (Cardiologist)
('Vinod', 'Chaturvedi', 60, 'Male', '9848122311', 'vinod.chaturvedi@example.com', 'High blood pressure management', 7),
('Rekha', 'Mishra', 49, 'Female', '9848122312', 'rekha.mishra@example.com', 'Heart murmur check-up', 7),

-- Patients for Dr. Sophia (Cardiologist)
('Sameer', 'Naik', 52, 'Male', '9848122321', 'sameer.naik@example.com', 'Chest pain and ECG test', 8),
('Deepika', 'Sharma', 34, 'Female', '9848122322', 'deepika.sharma@example.com', 'Cholesterol level assessment', 8);



CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'canceled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    CHECK (appointment_time BETWEEN '09:00:00' AND '13:00:00')
);
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) 
VALUES (1, 2, '2025-03-14', '09:30:00', 'scheduled');


INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES
(2, 1, '2025-03-14', '10:00:00', 'completed'),
(3, 4, '2025-03-15', '11:15:00', 'scheduled');
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES
(4, 3, '2025-03-16', '12:45:00', 'canceled'),
(5, 2, '2025-03-17', '10:30:00', 'scheduled'),
(6, 1, '2025-03-18', '09:45:00', 'completed');



CREATE TABLE reschedule_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    requested_new_date DATE NOT NULL,
    requested_new_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE
);


CREATE TABLE video_consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    doctor VARCHAR(100) NOT NULL,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from doctors;

select * from doctor_availability;
select * from appointments;
select * from patients;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM doctor_availability;
SET SQL_SAFE_UPDATES = 1;
delete from doctors;
ALTER TABLE appointments ADD COLUMN medical_condition TEXT;


delete from patients where patient_id =47;

SELECT * FROM doctor_availability WHERE status = 'on_leave';
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS doctor_availability;
DROP TABLE IF EXISTS doctors;
drop database hospital_db;
select * from appointments;
ALTER TABLE appointments 
ADD CONSTRAINT fk_patient FOREIGN KEY (patient_id) 
REFERENCES patients(patient_id) ON DELETE CASCADE;

CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from enquiries;

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    contact VARCHAR(15),
    email VARCHAR(100),
    department VARCHAR(50),
    appointment_experience ENUM('Easy', 'Moderate', 'Difficult'),
    billing_experience ENUM('Smooth', 'Some Issues', 'Difficult'),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


select * from feedback;
drop table feedback;
SHOW COLUMNS FROM feedback;

import express from "express";
import * as authController from "../controllers/auth.js";
import * as doctorController from "../controllers/doctor.js";
import * as appointmentController from "../controllers/Appointment.js";
import * as fileController from "../controllers/Appwrite.js";
import * as patientController from "../controllers/patient.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { upload } from "../lib/multer.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyRefresh } from "../middleware/verifyRefresh.js";

const router = express.Router();

// Authentication Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login/doctor", authController.loginDoctor);
router.get("/refresh", authController.handleRefreshToken);
router.post("/logout", authController.logout);

// Patient Routes
router.get("/getpatientappointment", verifyJWT, appointmentController.getAppointmentByPatient);
router.get("/getuser", verifyJWT, patientController.getPatient);
router.put("/updateuser", verifyJWT, verifyRole("patient"), patientController.updatePatient);
router.get("/patientexist", patientController.patientExist);

// Doctor Routes (Restricted)
router.get("/getdoctor", verifyJWT, doctorController.getdoctor);
router.put("/approveappointment", verifyJWT, verifyRole('doctor'), doctorController.approveAppointment);
router.get("/getdoctordetails", verifyJWT, verifyRole('doctor'), doctorController.getDoctorDetails);
router.put("/updatedoctordetails", verifyJWT, verifyRole('doctor'), doctorController.updateDoctorDetails);

// Appointment Routes (Restricted)
router.post("/schedule", verifyJWT, verifyRole('patient'), appointmentController.scheduleAppointment);
router.get("/getappointmentdetails", verifyJWT, appointmentController.getAppointmentDetails);
router.get("/getappointment", verifyJWT, verifyRole('doctor'), appointmentController.getAppointment);
router.put("/recordappointment", verifyJWT, verifyRole('doctor'), appointmentController.recordAppointment);
router.delete("/cancelappointment", verifyJWT,  appointmentController.cancelAppointment);

// File Management (Restricted)
router.get("/getRecords", verifyJWT,   fileController.getRecords);
router.post("/upload", verifyJWT, upload.single("file"), fileController.uploadFile);
router.delete("/delete", verifyJWT, fileController.deleteFile);

// OTP Authentication
router.post("/generateotp", authController.localVariables, authController.OTPSender);
router.post("/verifyotp", authController.verifyOTP);
router.post("/forgotid", authController.forgotID);

// Additional Routes
router.put("/approve", verifyJWT, verifyRole('doctor'), doctorController.approveAppointment); // Approve route
router.get("/isauth", verifyJWT,verifyRefresh); // isAuth route

export default router;

// Authentication Routes
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.post("/login/doctor", authController.loginDoctor);
// router.get("/refresh", authController.handleRefreshToken);
// router.post("/logout", authController.logout);
// router.get("/isauth", verifyJWT, authController.isAuthenticated);

// // Patient Routes
// router.get("/getpatientappointment", verifyJWT, doctorController.getAppointmentByPatient);
// router.get("/getuser", verifyJWT, getPatient);
// router.put("/updateuser", verifyJWT, verifyRole("patient"), updatePatient);
// router.get("/patientexist",patientExist);

// // Doctor Routes (Restricted)
// router.get("/getdoctor", verifyJWT, doctorController.getdoctor);
// router.put("/approveappointment", verifyJWT, verifyRole("doctor"), doctorController.approveAppointment);
// router.get("/getdoctordetails", verifyJWT, verifyRole("doctor"), doctorController.getDoctorDetails);
// router.put("/updatedoctordetails", verifyJWT, verifyRole("doctor"), doctorController.updateDoctorDetails);



// // Appointment Routes (Restricted)
// router.post("/schedule", verifyJWT, verifyRole("patient"), appointmentController.scheduleAppointment);
// router.get("/getappointmentdetails", verifyJWT, appointmentController.getAppointmentDetails);
// router.get("/getappointment", verifyJWT, verifyRole("doctor"), appointmentController.getAppointment);
// router.put("/recordappointment", verifyJWT, verifyRole("doctor"), appointmentController.recordAppointment);
// router.get("/getappointmentbypatient", verifyJWT, doctorController.getAppointmentByPatient);
// router.put("/approve", verifyJWT, doctorController.approveAppointment);
// router.get("/getpatientappointment", verifyJWT, appointmentController.getPatientAppointments);
// router.get("/remainder", verifyJWT, appointmentController.getAppointmentReminder);
// //Approve
// //getPatient appointment
// //isauth
// //verify user

// router.delete("/cancelappointment", verifyJWT, verifyRole("patient"), appointmentController.cancelAppointment);

// // File Management (Restricted)
// router.get("/getRecords", verifyJWT, verifyRole("doctor","patient"), getRecords);
// router.post("/upload", verifyJWT, upload.single("file"), fileController.uploadFile);
// router.delete("/delete", verifyJWT, fileController.deleteFile);

// // OTP Authentication
// router.post("/generateotp", authController.localVariables, authController.OTPSender);
// router.post("/verifyotp", authController.verifyOTP);
// router.post("/forgotid", authController.forgotID);


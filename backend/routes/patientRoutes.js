import express from "express";
import * as patientController from "../controllers/patient.js";
import * as appointmentController from "../controllers/Appointment.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/getpatientappointment", verifyJWT, appointmentController.getAppointmentByPatient);
router.get("/getuser", verifyJWT, patientController.getPatient);
router.put("/updateuser", verifyJWT, verifyRole("patient"), patientController.updatePatient);
router.get("/patientexist", patientController.patientExist);

export default router;
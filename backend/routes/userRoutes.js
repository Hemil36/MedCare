import express from "express";
import * as doctorController from "../controllers/doctor.js";
import * as patientController from "../controllers/patient.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

// Combined profile endpoint
router.get("/profile", verifyJWT, (req, res) => {
  const { role } = req.user;
  if (role === "doctor") {
    return doctorController.getdoctor(req, res);
  }
  return patientController.getPatient(req, res);
});

// Combined profile update endpoint
router.put("/profile", verifyJWT, (req, res) => {
  const { role } = req.user;
  if (role === "doctor") {
    return doctorController.updateDoctorDetails(req, res);
  }
  return patientController.updatePatient(req, res);
});

export default router;
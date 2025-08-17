import express from "express";
import * as appointmentController from "../controllers/Appointment.js";
import * as doctorController from "../controllers/doctor.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.post("/", verifyJWT, verifyRole('patient'), appointmentController.scheduleAppointment);
router.get("/:id", verifyJWT, appointmentController.getAppointmentDetails);

// Combined appointment listing endpoint
router.get("/", verifyJWT, (req, res) => {
  const { role } = req.user;
  if (role === "doctor") {
    return appointmentController.getAppointment(req, res);
  }
  return appointmentController.getAppointmentByPatient(req, res);
});

router.put("/:id/approve", verifyJWT, verifyRole('doctor'), doctorController.approveAppointment);
router.put("/:id/record", verifyJWT, verifyRole('doctor'), appointmentController.recordAppointment);
router.delete("/:id", verifyJWT, appointmentController.cancelAppointment);

export default router;
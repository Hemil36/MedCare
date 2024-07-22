import express from 'express';
import * as authController from '../controllers/auth.js';
import * as doctorController from '../controllers/doctor.js';
const router = express.Router();


router.post('/register', authController.register )
router.post('/login', authController.login )


router.get("/getdoctor",doctorController.getdoctor)
router.post("/schedule",doctorController.scheduleappointment)
router.post("/getappointmentdetails",doctorController.getAppointmentDetails)

export default router;
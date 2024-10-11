import express from 'express';
import * as authController from '../controllers/auth.js';
import * as doctorController from '../controllers/doctor.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { verifyRefresh } from '../middleware/verifyRefresh.js';
import { appointmentEmail, confirmEmail, recordEmail } from '../controllers/email.js';
import { getPatient, patientExist, updatePatient } from '../controllers/patient.js';
const router = express.Router();


router.post('/register', authController.register )
router.get("/getdoctor",verifyJWT , doctorController.getdoctor)
router.post("/schedule",verifyJWT ,doctorController.scheduleappointment)
router.post("/getappointmentdetails",verifyJWT ,doctorController.getAppointmentDetails)
router.get("/getappointment",verifyJWT ,doctorController.getAppointment)
router.post("/getappointmentbydoctor",verifyJWT,doctorController.getDocAppointment)
router.post("/approveappointment",verifyJWT ,doctorController.approveAppointment);
router.post("/recordappointment",verifyJWT ,doctorController.recordAppointment);
router.post("/cancelappointment",verifyJWT ,doctorController.cancelAppointment);
router.post("/generateotp",authController.localVariables,authController.OTPSender)
router.post("/verifyotp",authController.verifyOTP)
router.post("/login",authController.login)
router.post("/login/doctor",authController.loginDoctor)
router.get("/refresh",authController.handleRefreshToken)
router.post("/getpatientappointment",verifyJWT,doctorController.getAppointmentByPatient)
router.get("/isauth",verifyRefresh)
router.post("/verifyuser", authController.verifyUser)
router.post("/verifydoctor",doctorController.verifyDoctor)
router.post("/verifyexistdoctor",doctorController.veryExistingDoctor)
router.post("/getuser",verifyJWT,getPatient)
router.post("/updateuser",verifyJWT,updatePatient)
router.post("/patientexist",patientExist)
router.post("/getdoctordetails",verifyJWT,doctorController.getDoctorDetails)
router.post("/logout",authController.logout)
router.post("/updatedoctordetails",verifyJWT,doctorController.updateDoctorDetails)
router.post("/forgotid" , authController.forgotID)


export default router;
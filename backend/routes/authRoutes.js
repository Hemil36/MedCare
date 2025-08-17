import express from "express";
import * as authController from "../controllers/auth.js";
import * as doctorController from "../controllers/doctor.js";
import * as patientController from "../controllers/patient.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRefresh } from "../middleware/verifyRefresh.js";

const router = express.Router();

router.post("/register", authController.register);
router.get("/isauth", verifyJWT, verifyRefresh);

// Combined login endpoint
router.post("/login", (req, res) => {
  const { role } = req.body;

  if(!role)
    return res.status(400).json({ error: "Role is required" });
  if (role === "doctor") {
    return authController.loginDoctor(req, res);
  }else 
  return authController.login(req, res);
});

router.get("/refresh", authController.handleRefreshToken);
router.post("/logout", authController.logout);

// Combined verification endpoint
router.post("/verify", (req, res) => {
  const { role } = req.body;
  if (role === "doctor") {
    return doctorController.verifyDoctor(req, res);
  }
  return authController.verifyUser(req, res);
});

// Combined user existence check
router.post("/exists", (req, res) => {
  const { role } = req.body;
  if (role === "doctor") {
    return doctorController.veryExistingDoctor(req, res);
  }
  return patientController.patientExist(req, res);
});

router.get("/status", verifyJWT, verifyRefresh);

// OTP flow
router.post("/otp/generate", authController.localVariables, authController.OTPSender);
router.post("/otp/verify", authController.verifyOTP);
router.post("/recovery", authController.forgotID);

export default router;
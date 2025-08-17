import express from "express";
import * as doctorController from "../controllers/doctor.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/details", verifyJWT, verifyRole('doctor'), doctorController.getDoctorDetails);

export default router;

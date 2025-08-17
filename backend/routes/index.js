import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import fileRoutes from "./fileRoutes.js";
import systemRoutes from "./systemRoutes.js";
import patientRoutes from "./patientRoutes.js";

const router = express.Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/patients",patientRoutes)
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/files", fileRoutes);
router.use("/system", systemRoutes);

export default router;

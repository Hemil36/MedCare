import express from "express";
import reminder from "../services/reminder.js";

const router = express.Router();

router.get("/reminder", reminder);

export default router;
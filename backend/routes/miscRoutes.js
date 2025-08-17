import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRefresh } from "../middleware/verifyRefresh.js";
import reminder from "../services/reminder.js";

const router = express.Router();

router.get("/reminder", reminder);

export default router;
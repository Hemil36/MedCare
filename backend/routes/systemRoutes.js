import express from "express";
import reminder from "../services/reminder.js";
import RedisService from "../lib/redis/redisService.js";
import { upload } from "../lib/multer.js";
import { jobVerify, getStatus, jobResult, health, upload as jobUpload } from "../controllers/redis.js";

const router = express.Router();

router.get("/reminder", reminder);


// Job Management Endpoints
router.post('/jobs/create', upload.single("file"), jobUpload);  // Create a new job from PDF
router.get('/jobs/:jobId/status', getStatus);                   // Get job status
router.get('/jobs/:jobId/result', jobResult);                   // Get job results
router.post('/jobs/:jobId/verify', jobVerify);                  // Verify job and migrate to appointment
router.get('/system/health', health);                           // System health check

export default router;
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middleware/credentials.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";
import RedisService from "./lib/redis/redisService.js";
import { initJobSubscription } from "./services/jobSubscriptionService.js";

dotenv.config();

// Initialize Redis service (singleton for the whole application)
const redisService = new RedisService({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Export the Redis service so other modules can use it
export { redisService };

const app = express();

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

const subscriber = initJobSubscription();
// // Subscribe to job completions from Redis
// const subscriber = redisService.subscribeToJobCompletions(async (data) => {
//   try {
//     const { jobId, status, completedAt, error } = data;
//     console.log(`Job completion notification received: ${jobId} - ${status}`);
    
//     // Update job in MongoDB
//     const job = await Job.findOne({ jobId });
//     if (job) {
//       job.status = status;
//       job.completedAt = new Date(completedAt);
      
//       if (status === 'error') {
//         job.error = error;
//       } else if (status === 'completed') {
//         // Fetch the result from Redis
//         const resultJson = await redisService.get(`pdf_result:${jobId}`);
//         if (resultJson) {
//           try {
//             job.result = JSON.parse(resultJson);
//           } catch (e) {
//             console.error(`Error parsing result for job ${jobId}:`, e);
//             job.result = { error: "Failed to parse result" };
//           }
//         }
//       }
      
//       await job.save();
//       console.log(`Job ${jobId} status updated to ${status} in MongoDB`);
//     } else {
//       console.error(`Job ${jobId} not found in MongoDB`);
//     }
//   } catch (error) {
//     console.error('Error handling job completion:', error);
//   }
// });

// Make sure to handle cleanup during application shutdown
process.on('SIGINT', () => {
  if (subscriber) {
    subscriber.unsubscribe();
    subscriber.quit();
  }
  redisService.close().catch(console.error);
  console.log('Redis connections closed');
  process.exit(0);
});

app.use("/api/v1", router); // Changed to match your frontend paths

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is Running" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
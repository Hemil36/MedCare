import  redisService  from "../lib/redis/redisClient.js";
import { Job } from "../models/Job.js";

export function initJobSubscription() {
  const subscriber = redisService.subscribeToJobCompletions(async (data) => {
    try {
      const { jobId, status, completedAt, error } = data;
      console.log(`Job completion notification received: ${jobId} - ${status}`);
      
      // Update job in MongoDB
      const job = await Job.findOne({ jobId });
      if (job) {
        job.status = status;
        job.completedAt = new Date(completedAt);
        
        if (status === 'error') {
          job.error = error;
        } else if (status === 'completed') {
          // Fetch the result from Redis
          const resultJson = await redisService.get(`pdf_result:${jobId}`);
          if (resultJson) {
            try {
              job.result = JSON.parse(resultJson);
            } catch (e) {
              console.error(`Error parsing result for job ${jobId}:`, e);
              job.result = { error: "Failed to parse result" };
            }
          }
        }
        
        await job.save();
        console.log(`Job ${jobId} status updated to ${status} in MongoDB`);
      } else {
        console.error(`Job ${jobId} not found in MongoDB`);
      }
    } catch (error) {
      console.error('Error handling job completion:', error);
    }
  });
  
  return subscriber;
}
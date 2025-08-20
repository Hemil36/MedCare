import { Job } from "../models/Job.js";
import Appointment from '../models/AppointmentRecord.js';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import redisService from "../lib/redis/redisClient.js";



// PDF Upload endpoint - now with async processing
export const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const { userId } = req.body;
  try {
    const pdfBase64 = req.file.buffer.toString("base64");
    const jobId = uuid(); // Generate a unique ID

    // Create job entry in MongoDB
    const job = new Job({
      jobId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      clientInfo: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      },
      status: 'pending',
      userId
    });
    await job.save();
    
    // Publish job using Redis service
    await redisService.publishJob("pdf_jobs", { jobId, pdfBase64 });
    console.log("Job Pushed:", jobId);
    
    // Return job ID immediately to client (don't wait for processing)
    res.status(202).json({ 
      success: true, 
      message: "PDF uploaded and queued for processing",
      jobId,
      statusUrl: `/jobs/${jobId}/status`,
      resultUrl: `/jobs/${jobId}/result`
    });
  } catch (error) {
    console.error(`Upload error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job status endpoint
 export const getStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check job status in MongoDB
    const job = await Job.findOne({ jobId }).select('-result');
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({
      success: true,
      jobId,
      status: job.status,
      fileName: job.fileName,
      queuedAt: job.queuedAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      verified: job.verified,
      verifiedAt: job.verifiedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job result endpoint
export const jobResult = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // First check MongoDB (for complete history)
    const job = await Job.findOne({ jobId });
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    if (job.status === 'completed') {
      return res.json({
        success: true,
        jobId,
        result: job.result,
        verified: job.verified,
        completedAt: job.completedAt
      });
    }
    
    // If not completed in MongoDB, check Redis for latest results
    const redisResult = await redisService.get(`pdf_result:${jobId}`);
    
    if (redisResult) {
      try {
        // Update MongoDB with the Redis result
        const parsedResult = JSON.parse(redisResult);
        job.status = 'completed';
        job.result = parsedResult;
        job.completedAt = new Date();
        await job.save();
        
        return res.json({
          success: true,
          jobId,
          result: parsedResult,
          completedAt: job.completedAt,
          verified: false
        });
      } catch (parseError) {
        console.error(`Error parsing result for job ${jobId}:`, parseError);
        return res.status(500).json({
          success: false,
          message: 'Error parsing job result',
          error: parseError.message
        });
      }
    }
    
    // If not found in Redis either, return current status
    return res.json({
      success: true,
      jobId,
      status: job.status,
      message: 'Processing not completed yet'
    });
  } catch (error) {
    console.error(`Job result error:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verification endpoint for manual approval
export const jobVerified = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { verified, notes, correctedData } = req.body;
    
    // Find job in MongoDB
    const job = await Job.findOne({ jobId });
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    // Update verification status
    job.verified = verified;
    job.verificationNotes = notes;
    job.verifiedAt = new Date();
    // job.verifiedBy = req.user?.id; // If you implement authentication later
    
    // If corrected data provided, update the result
    if (correctedData) {
      job.result = correctedData;
    }
    
    await job.save();
    
    res.json({
      success: true,
      message: 'Verification updated successfully',
      jobId,
      verified
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Health check endpoint
export const health = async (req, res) => {
  try {
    // Use Redis service health check
    const redisHealth = await redisService.checkHealth();
    
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: redisHealth.status === 'healthy' && mongoStatus === 'connected' ? 'healthy' : 'degraded',
      redis: redisHealth,
      mongodb: {
        status: mongoStatus
      },
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      redis: 'disconnected'
    });
  }
};


/**
 * Verification endpoint for manual approval with data migration
 */
export const jobVerify = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { verified, notes, correctedData } = req.body;
    
    // Find job in MongoDB
    const job = await Job.findOne({ jobId });
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    // Update verification status
    job.verified = verified;
    job.verificationNotes = notes;
    job.verifiedAt = new Date();
    
    // If corrected data provided, update the result
    const finalData = correctedData || job.result;
    
    // Only proceed with DB operations if the job is verified
    if (verified === true) {
      try {
        // Start a session to ensure atomicity of operations
        const session = await mongoose.startSession();
        
        let appointmentId;
        
        await session.withTransaction(async () => {
          // 1. Find patient and doctor IDs
          const patient = await mongoose.model('patient').findOne({ 
            patientID: finalData.patientId 
          }).session(session);
          
          const doctor = await mongoose.model('doctor').findOne({ 
            doctorID: finalData.doctorId 
          }).session(session);
          
          if (!patient || !doctor) {
            throw new Error(`Patient or doctor not found for IDs: ${finalData.patientId}, ${finalData.doctorId}`);
          }
          
          // 2. Transform medications to match your Medicine schema
          const medications = finalData.medications.map(med => ({
            name: med.name,
            dose: med.dosage || med.dose || 'N/A',
            frequency: med.frequency || 'N/A',
            duration: med.duration || 'N/A'
          }));
          
          // 3. Create new appointment record
          const appointment = new Appointment({
            patientID: patient._id,
            doctorID: doctor._id,
            date: finalData.date || new Date(),
            notes: finalData.notes || '',
            symptoms: finalData.symptoms || '',
            prescription: medications,
            status: "completed",
            diagnosis: finalData.diagnosis || 'N/A',
            completedAt: new Date()
          });
          
          // 4. Save the new appointment
          const savedAppointment = await appointment.save({ session });
          appointmentId = savedAppointment._id;
          
          // 5. Delete the job entry
          await Job.deleteOne({ jobId: job.jobId }, { session });
        });
        
        // If transaction completed successfully
        return res.json({
          success: true,
          message: 'Verification completed and appointment record saved',
          appointmentId // Return the new appointment ID
        });
      } catch (transactionError) {
        console.error(`Transaction error: ${transactionError.message}`);
        // If transaction fails, we'll just update the job without deleting
        job.result = finalData;
        await job.save();
        
        return res.status(500).json({
          success: false, 
          message: 'Failed to migrate data to appointment records',
          error: transactionError.message
        });
      }
    } else {
      // If not verified, just update the job
      job.result = finalData;
      await job.save();
      
      return res.json({
        success: true,
        message: 'Verification updated successfully',
        jobId,
        verified
      });
    }
  } catch (error) {
    console.error(`Verification error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
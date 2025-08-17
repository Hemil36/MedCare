import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/User.js";
import { confirmEmail } from "./email.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Helper function for standardized responses
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * AI model configuration
 */
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "tunedModels/mednotify-proper-lj52zkhsshsf",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 * Generate AI response for appointment notifications
 * @param {string} params - Date parameters for AI model
 * @returns {Promise<string>} - AI generated text
 */
async function generateAppointmentNotification(params) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "2024-10-14T02:30:00.000+00:00\n" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Your next appointment is on 2024-10-14 at 02:30 AM. We'll be waiting! ",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "{'$date': '2025-04-09T13:76:34.000Z'}" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Friendly reminder: Your appointment is on 2025-04-09 at 01:76 PM. ",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(params);
    return result.response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Your appointment has been confirmed.";
  }
}

/**
 * Get all doctors or a specific doctor
 */
export const getdoctor = async (req, res) => {
  try {
    const { id } = req.query;
    
    // If id is provided, return specific doctor
    if (id) {
      const doctorDetails = await Doctor.findOne({ doctorID: id })
        .select("name email phone clinicAddress clinicPhoneNumber photo speciality doctorID");
      
      if (!doctorDetails) {
        return sendResponse(res, 404, false, "Doctor not found");
      }
      
      return sendResponse(res, 200, true, "Doctor retrieved successfully", doctorDetails);
    }
    
    // Otherwise return all doctors
    const doctorList = await Doctor.find()
      .select("name email phone clinicAddress clinicPhoneNumber photo speciality doctorID")
      .sort({ name: 1 }); // Sort by name
    
    if (doctorList.length === 0) {
      return sendResponse(res, 200, true, "No doctors found", []);
    }
    
    return sendResponse(res, 200, true, "Doctors retrieved successfully", doctorList);
  } catch (error) {
    console.error("Get Doctor Error:", error);
    return sendResponse(res, 500, false, "Failed to retrieve doctor(s)");
  }
};

/**
 * Update doctor details
 */
export const updateDoctorDetails = async (req, res) => {
  try {
    const { doctorID, data } = req.body;

    if (!doctorID) {
      return sendResponse(res, 400, false, "Doctor ID is required");
    }

    if (!data || Object.keys(data).length === 0) {
      return sendResponse(res, 400, false, "No update data provided");
    }

    // Find doctor
    const doctorDetails = await Doctor.findOne({ doctorID });
    if (!doctorDetails) {
      return sendResponse(res, 404, false, "Doctor not found");
    }
    
    // Only update allowed fields
    const allowedFields = [
      "name", "email", "phone", "clinicPhoneNumber", 
      "clinicAddress", "photo", "speciality"
    ];
    
    // Apply updates for allowed fields only
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        doctorDetails[field] = data[field];
      }
    });
    
    await doctorDetails.save();

    // Filter out sensitive fields
    const removeKeys = ["adhaarNumber", "identificationDocument", "identificationType"];
    const filteredDoctorDetails = Object.fromEntries(
      Object.entries(doctorDetails._doc).filter(([key]) => !removeKeys.includes(key))
    );

    return sendResponse(res, 200, true, "Doctor details updated successfully", filteredDoctorDetails);
  } catch (error) {
    console.error("Update Doctor Error:", error);
    return sendResponse(res, 500, false, "Failed to update doctor details");
  }
};

/**
 * Get doctor details
 */
export const getDoctorDetails = async (req, res) => {
  try {
    const doctorID = req.user.id;
    
    if (!doctorID) {
      return sendResponse(res, 400, false, "Doctor ID is required");
    }
    
    const doctorDetails = await Doctor.findOne({ doctorID })
      .select("name email phone gender clinicPhoneNumber clinicAddress photo speciality doctorID");
    
    if (!doctorDetails) {
      return sendResponse(res, 404, false, "Doctor not found");
    }
    
    return sendResponse(res, 200, true, "Doctor details retrieved successfully", doctorDetails);
  } catch (error) {
    console.error("Get Doctor Details Error:", error);
    return sendResponse(res, 500, false, "Failed to retrieve doctor details");
  }
};

/**
 * Approve an appointment and send confirmation email
 */
export const approveAppointment = async (req, res) => {
  try {
    const { appointmentID, date } = req.body;
    // Validate input
    if (!date) {
      return sendResponse(res, 400, false, "Appointment date is required");
    }

    if (!appointmentID) {
      return sendResponse(res, 400, false, "Appointment ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentID)) {
      return sendResponse(res, 400, false, "Invalid appointment ID format");
    }

    // Find and update appointment
    const appointment = await Appointment.findById(appointmentID)
      .populate("doctorID", "name email clinicAddress")
      .populate("patientID", "name email");
    
    if (!appointment) {
      return sendResponse(res, 404, false, "Appointment not found");
    }
    
    // Check if already approved/scheduled
    if (appointment.status === "scheduled") {
      return sendResponse(res, 400, false, "Appointment is already scheduled");
    }
    
    // Check if appointment was cancelled
    if (appointment.status === "cancelled") {
      return sendResponse(res, 400, false, "Cannot approve a cancelled appointment");
    }

    // Update appointment status and date
    appointment.status = "scheduled";
    appointment.date = new Date(date);
    await appointment.save();

    // Generate AI appointment notification
    let notificationText;
    try {
      notificationText = await generateAppointmentNotification(date);
    } catch (aiError) {
      console.error("AI Generation Error:", aiError);
      notificationText = "Your appointment has been confirmed.";
    }

    // Send confirmation email asynchronously
    confirmEmail({
      email: appointment.patientID.email,
      date,
      doctorName: appointment.doctorID.name,
      patientName: appointment.patientID.name,
      address: appointment.doctorID.clinicAddress,
      customMessage: notificationText
    }).catch(err => console.error("Failed to send confirmation email:", err));

    return sendResponse(res, 200, true, "Appointment approved successfully", appointment);
  } catch (error) {
    console.error("Approve Appointment Error:", error);
    return sendResponse(res, 500, false, "Failed to approve appointment");
  }
};

/**
 * Verify doctor credentials
 */
export const verifyDoctor = async (req, res) => {
  try {
    const { doctorID, email } = req.body;
    
    if (!doctorID || !email) {
      return sendResponse(res, 400, false, "Doctor ID and email are required");
    }
    
    const doctor = await Doctor.findOne({ doctorID });
    
    if (!doctor) {
      return sendResponse(res, 404, false, "Doctor not found");
    }
    
    if (doctor.email !== email) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }
    
    return sendResponse(res, 200, true, "Doctor verified successfully");
  } catch (error) {
    console.error("Verify Doctor Error:", error);
    return sendResponse(res, 500, false, "Verification failed");
  }
};

/**
 * Check if doctor with email already exists
 */
export const veryExistingDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }
    
    const doctor = await Doctor.findOne({ email });
    
    if (doctor) {
      return sendResponse(res, 409, false, "A doctor with this email already exists");
    }
    
    return sendResponse(res, 200, true, "Email is available");
  } catch (error) {
    console.error("Check Existing Doctor Error:", error);
    return sendResponse(res, 500, false, "Failed to check doctor existence");
  }
};

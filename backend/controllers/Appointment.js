import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import { sendEmail } from "./prescription.js";
import { appointmentEmail, cancelAppointment as cancelEmail } from "./email.js";
import Patient from "../models/User.js";
import Doctor from "../models/Doctor.js";

// Helper function for standardized responses
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) {
    if (Array.isArray(data)) {
      response.data = data;
      response.count = data.length;
    } else {
      response.data = data;
    }
  }
  return res.status(statusCode).json(response);
};

// Helper function to find and validate an appointment
const getValidAppointment = async (appointmentID, populateFields = true) => {
  console.log(appointmentID)
  if (!mongoose.Types.ObjectId.isValid(appointmentID)) {
    throw new Error("Invalid appointment ID format");
  }

  let query = Appointment.findById(appointmentID);
  
  if (populateFields) {
    query = query
      .populate("doctorID", "name email speciality clinicAddress")
      .populate("patientID", "name email phone patientID");
  }
  
  const appointment = await query;
  
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  
  return appointment;
};

/**
 * Record details of a completed appointment and send prescription
 */
export const recordAppointment = async (req, res) => {
  try {
    const { appointmentID, symptoms, notes, prescription, patientName, diagnosis, email, doctorName } = req.body;
    
    if (!appointmentID) {
      return sendResponse(res, 400, false, "Appointment ID is required");
    }

    // Get and validate appointment
    const appointment = await getValidAppointment(appointmentID);
    
    // Prevent modifying completed or cancelled appointments
    if (appointment.status === "completed") {
      return sendResponse(res, 400, false, "This appointment is already completed");
    }
    
    if (appointment.status === "cancelled") {
      return sendResponse(res, 400, false, "Cannot record a cancelled appointment");
    }
    
    // Update appointment with completed information
    Object.assign(appointment, {
      status: "completed",
      symptoms: symptoms || "",
      notes: notes || "",
      prescription: prescription || "",
      diagnosis: diagnosis || "N/A",
      completedAt: new Date()
    });
    
    await appointment.save();

    // Send prescription email asynchronously
    sendEmail({
      patientName,
      patientEmail: email,
      diagnosis,
      doctorName,
      remarks: notes,
      medicationPrescription: prescription,
      prescriptionDate: new Date(),
      appointmentID
    }).catch(err => console.error("Failed to send prescription email:", err));

    return sendResponse(res, 200, true, "Appointment recorded successfully", appointment);
  } catch (error) {
    console.error("Record Appointment Error:", error);
    return sendResponse(res, 500, false, error.message || "Internal Server Error");
  }
};

/**
 * Schedule a new appointment
 */
export const scheduleAppointment = async (req, res) => {
  try {
    const { doctorID, patientID, date, notes } = req.body;

    // Validate required fields
    if (!doctorID || !patientID || !date) {
      return sendResponse(res, 400, false, "Doctor ID, Patient ID, and appointment date are required");
    }

    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return sendResponse(res, 400, false, "Invalid date format. Please use a valid date string");
    }
    
    // Don't allow past dates
    if (appointmentDate < new Date()) {
      return sendResponse(res, 400, false, "Cannot schedule appointments in the past");
    }

    // Find doctor and patient in parallel for better performance
    const [doctor, patient] = await Promise.all([
      Doctor.findOne({ doctorID }).select("_id name clinicAddress"),
      Patient.findOne({ patientID }).select("_id email name")
    ]);

    if (!doctor || !patient) {
      return sendResponse(res, 404, false, "Invalid doctor or patient ID. Please check the IDs");
    }

    // Check for conflicting appointments
    const conflictExists = await Appointment.exists({
      doctorID: doctor._id,
      date: {
        $gte: new Date(appointmentDate.getTime() - 30 * 60000), // 30 minutes before
        $lte: new Date(appointmentDate.getTime() + 30 * 60000)  // 30 minutes after
      },
      status: { $nin: ['cancelled', 'rejected'] }
    });

    if (conflictExists) {
      return sendResponse(res, 409, false, "This time slot is already booked");
    }

    // Create and save appointment
    const appointment = new Appointment({
      doctorID: doctor._id,
      patientID: patient._id,
      date: appointmentDate,
      notes: notes || "",
      status: "pending"
    });

    await appointment.save();

    // Send confirmation email asynchronously
    appointmentEmail({
      email: patient.email,
      patientName: patient.name,
      doctorName: doctor.name,
      date: appointmentDate.toDateString(),
      address: doctor.clinicAddress
    }).catch(err => console.error("Failed to send appointment email:", err));

    return sendResponse(res, 201, true, "Appointment scheduled successfully", {
      appointmentID: appointment._id,
      date: appointment.date,
      status: appointment.status
    });
  } catch (error) {
    console.error("Schedule Appointment Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error. Please try again later");
  }
};

/**
 * Get details of a specific appointment
 */
export const getAppointmentDetails = async (req, res) => {
  try {
    const { id: appointmentID } = req.params;
    console.log("Fetching appointment details for ID:", appointmentID);

    if (!appointmentID) {
      return sendResponse(res, 400, false, "Appointment ID is required");
    }

    const appointment = await getValidAppointment(appointmentID);
    
    return sendResponse(res, 200, true, "Appointment details retrieved", {
      appointment,
      doctorDetails: appointment.doctorID
    });
  } catch (error) {
    console.error("Get Appointment Details Error:", error);
    return sendResponse(res, error.message.includes("Invalid") ? 400 : 500, false, error.message);
  }
};

/**
 * Get appointments for a doctor with filtering and pagination
 */
export const getAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "doctor") {
      return sendResponse(res, 403, false, "Access denied: Only doctors can view these appointments");
    }

    const doctorID = req.user.id;
    
    if (!doctorID) {
      return sendResponse(res, 400, false, "Doctor ID is missing in the token");
    }
    // Find doctor's MongoDB _id
    const doctor = await Doctor.findOne({ doctorID }).select("_id");
    if (!doctor) {
      return sendResponse(res, 404, false, "Doctor not found");
    }


    // Process query parameters
    const { date, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Build filter query
    const filter = { doctorID: doctor._id };
    
    // Handle date filtering
    if (date) {
      const queryDate = new Date(date);
      if (!isNaN(queryDate.getTime())) {
        const startDate = new Date(queryDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(queryDate);
        endDate.setHours(23, 59, 59, 999);
        
        filter.date = { $gte: startDate, $lte: endDate };
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filter.date = { $gte: today, $lt: tomorrow };
    }
    
    // Status filtering
    if (status && ['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    // Get total count and appointments (parallel queries for efficiency)
    const [total, appointments] = await Promise.all([
      Appointment.countDocuments(filter),
      Appointment.find(filter)
        .populate("doctorID", "name email speciality")
        .populate("patientID", "name email phone patientID")
        .sort({ date: 1 })
    ]);


    return sendResponse(res, 200, true, appointments.length > 0 
      ? "Appointments retrieved successfully" 
      : "No appointments found",
      {
        appointments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    );
  } catch (error) {
    console.error("Get Appointments Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error. Please try again later");
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.query;
    const { reason } = req.body;
    
    if (!appointmentID) {
      return sendResponse(res, 400, false, "Appointment ID is required");
    }

    // Get and validate appointment
    const appointment = await getValidAppointment(appointmentID);
    
    // Prevent cancelling already completed or cancelled appointments
    if (appointment.status === "completed") {
      return sendResponse(res, 400, false, "Cannot cancel a completed appointment");
    }
    
    if (appointment.status === "cancelled") {
      return sendResponse(res, 400, false, "This appointment is already cancelled");
    }
    
    // Update appointment status
    appointment.status = "cancelled";
    appointment.cancellationReason = reason || "No reason provided";
    appointment.cancelledBy = req.user?.role || "system";
    appointment.cancelledAt = new Date();
    
    await appointment.save();

    // Send cancellation email asynchronously
    cancelEmail({
      email: appointment.patientID.email,
      patientName: appointment.patientID.name,
      reason: reason || "The appointment has been cancelled"
    }).catch(err => console.error("Failed to send cancellation email:", err));

    return sendResponse(res, 200, true, "Appointment cancelled successfully", appointment);
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return sendResponse(res, error.message.includes("Invalid") ? 400 : 500, false, error.message);
  }
};

/**
 * Get all appointments for a patient with filtering and pagination
 */
export const getAppointmentByPatient = async (req, res) => {
  try {
    const { patientID } = req.query;
    const { status, page = 1, limit = 1000, sortBy = "date", sortOrder = "desc" } = req.query;
    
    if (!patientID) {
      return sendResponse(res, 400, false, "Patient ID is required");
    }

    // Find patient's MongoDB _id
    const patient = await Patient.findOne({ patientID }).select("_id");
    if (!patient) {
      return sendResponse(res, 404, false, "Patient not found");
    }
    
    // Build filter query
    const filter = { patientID: patient._id };
    
    // Add status filter if provided
    if (status && ['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    
    // Parse pagination params
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    
    // Get total count and appointments (parallel queries)
    const [total, appointments] = await Promise.all([
      Appointment.countDocuments(filter),
      Appointment.find(filter)
        .populate("doctorID", "name doctorID email speciality")
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
    ]);
    
    // Filter out null entries and format response
    const validAppointments = appointments.filter(Boolean);
    
    return sendResponse(res, 200, true, "Appointments retrieved", {
      appointments: validAppointments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Get Appointment By Patient Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", { error: error.message });
  }
};

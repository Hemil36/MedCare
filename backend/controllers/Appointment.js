import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import { sendEmail } from "./prescription.js";
import { appointmentEmail } from "./email.js";
import Patient from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { cancelAppointment as cancelEmail } from "./email.js";

export const recordAppointment = async (req, res) => {
  try {
    const { appointmentID, symptoms, notes, prescription, patientName, diagnosis, email, doctorName } = req.body;
    if (!appointmentID) return res.status(400).json({ message: "Please enter appointmentID" });

    const appointment = await Appointment.findById(appointmentID);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "completed";
    appointment.symptoms = symptoms;
    appointment.notes = notes;
    appointment.prescription = prescription;
    appointment.diagnosis = diagnosis;
    await appointment.save();

    await sendEmail({
      patientName,
      patientEmail: email,
      diagnosis,
      doctorName,
      remarks: notes,
      medicationPrescription: prescription,
      prescriptionDate: new Date()
    });

    res.status(201).json({ message: "Appointment recorded successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  export const scheduleAppointment = async (req, res) => {
    try {
      const { doctorID, patientID, date } = req.body;
  
      // Validate required fields
      if (!doctorID || !patientID || !date) {
        return res.status(400).json({ 
          success: false, 
          message: "doctorId, patientId, and date are required fields." 
        });
      }
  
      const doctor = await Doctor.findOne({ doctorID }).select("_id name  clinicAddress");
      const patient = await Patient.findOne({ patientID }).select("_id email name");
  
      if (!doctor || !patient) {
        return res.status(404).json({ 
          success: false, 
          message: "Invalid doctorId or patientId. Please check the IDs." 
        });
      }
  
      // Ensure the date is valid
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid date format. Please use a valid ISO date string." 
        });
      }

  
      // Store appointment using MongoDB `_id`
      const appointment = new Appointment({
        doctorID: doctor._id, 
        patientID: patient._id, 
        date: appointmentDate,
      });
  
      await appointment.save();



      await appointmentEmail({
        email: patient.email,
        patientName: patient.name,
        doctorName: doctor.name,
        date: appointmentDate.toDateString(),
        address: doctor.clinicAddress
      });
  
      return res.status(201).json({ 
        success: true, 
        message: "Appointment scheduled successfully", 
        appointment 
      });
  
    } catch (error) {
      console.error("Schedule Appointment Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error. Please try again later." 
      });
    }
  };


  export const getAppointmentDetails = async (req, res) => {
    const { appointmentID } = req.body;
    if (!appointmentID) {
      return res.status(400).json({ message: "Please enter appointmentID" });
    }
    try {
      const objectid = new mongoose.Types.ObjectId(appointmentID);
      const appointment = await Appointment.findById(appointmentID)
  .populate("doctorID", "name email speciality clinicAddress")
  .populate("patientID", "name email phone");

      if (!appointment) {
        return res.status(400).json({ message: "Appointment not found" });
      }
  
      res.status(200).json({ appointment, doctorDetails : appointment.doctorID });
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };

  
  export const getAppointment = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "doctor") {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied: Only doctors can view appointments." 
        });
      }
  
      const doctorID = req.user.id; // Extract from JWT payload
  
      if (!doctorID) {
        return res.status(400).json({ 
          success: false, 
          message: "Doctor ID is missing in the token." 
        });
      }

      const doctor = await Doctor.findOne({ doctorID }).select("_id");
  
      // Fetch only appointments assigned to the logged-in doctor
      const appointments = await Appointment.find({ doctorID : doctor })
        .populate("doctorID", "name email speciality")
        .populate("patientID", "name email phone");
  
      if (!appointments.length) {
        return res.status(200).json({ 
          success: false, 
          message: "No appointments found for this doctor." 
        });
      }
  
      res.status(200).json({ 
        success: true, 
        message: "Appointments retrieved successfully.",
        data: appointments
      });
  
    } catch (error) {
      console.error("Get Appointments Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error. Please try again later." 
      });
    }
  };
  
  export const getDocAppointment = async (req, res) => {
    try {
      const { patientID } = req.body;
      if (!patientID) {
        return res.status(400).json({ message: "Please enter patientID" });
      }
  
      // Convert patientID to `_id`
      const patient = await Patient.findOne({ patientID }).select("_id");
      if (!patient) {
        return res.status(404).json({ message: "Patient not found." });
      }
  
      // Fetch appointments and populate doctor details
      const appointments = await Appointment.find({ patient: patient._id })
        .populate({ path: "doctor", select: "doctorID name email speciality" }) // Populate doctor details
        .select("-__v"); // Exclude internal fields
  
      if (!appointments.length) {
        return res.status(404).json({ message: "No appointments found for this patient." });
      }
  
      res.status(200).json({ success: true, appointments });
  
    } catch (error) {
      console.error("Get Doctor Appointment Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  
  export const cancelAppointment = async (req, res) => {
    const  appointmentID  = req.body.appointmentID;
    if (!appointmentID) {
      return res.status(400).json({ message: "Please enter appointmentID" });
    }
    try {
      const appointment = await Appointment.findById({ _id: appointmentID  }).populate("patientID", "name email");
      if (!appointment) {
        return res.status(400).json({ message: "Appointment not found" });
      }
      appointment.status = "cancelled";
      await appointment.save();
      await cancelEmail({
        email: appointment.patientID.email,
        patientName: appointment.patientID.name,
      });
      res.status(200).json(appointment);
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };
  

  export const getAppointmentByPatient = async (req, res) => {
    try {
      const { patientID } = req.body;
      if (!patientID) {
        return res.status(400).json({ message: "Please enter patientID" });
      }
  
      const patient = await Patient.findOne({ patientID }).select("_id");
      if (!patient) {
        return res.status(404).json({ message: "Patient not found." });
      }
  
      
      const appointments = await Appointment.find({ patientID: patient })
      .populate(  "doctor",  "name doctorID email speciality" ) 
      
      if (appointments.length === 0) {
        return res.status(200).json({ message: "No appointments found." });
      }
      res.status(200).json(newData.filter(item => item !== null));
  
    } catch (error) {
      console.error("Get Appointment By Patient Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
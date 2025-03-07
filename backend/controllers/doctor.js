import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import doctor from "../models/Doctor.js";
import Patient from "../models/User.js";
import { confirmEmail } from "./email.js";
import nodemailer from "nodemailer";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

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

async function run(params) {
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
            text: "Your next appointment is on 2024-10-14 at 02:30 AM. We’ll be waiting! ",
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
}

export const getdoctor = async (req, res) => {
  try {
    const doctorList = await doctor.find().select("name email phone clinicAddress clinicPhoneNumber photo speciality doctorID  ");
    if (doctorList.length === 0) {
      return res.status(400).json({ message: "No doctor found" });
    } else {
      res.status(200).json(doctorList);
    }
  } catch (error) {
    res.json({ message: "Try Again after Some Time" });
    console.log(error);
  }
};



export const updateDoctorDetails = async (req, res) => {
 
  const { doctorID , data } = req.body;

  if (!doctorID) {
    return res.status(400).json({ message: "Please enter doctorID" });
  }

  if (
    !data
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const doctorDetails = await doctor.findOne({ doctorID: doctorID });
    if (!doctorDetails) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    if(data?.name) doctorDetails.name = data.name;
    if(data?.email)doctorDetails.email = data.email;
    if(data?.phone)doctorDetails.phone = data.phone;
    if(data?.clinicPhoneNumber)doctorDetails.clinicPhoneNumber = data.clinicPhoneNumber;
    if(data?.clinicAddress)doctorDetails.clinicAddress = data.clinicAddress;
    if(data?.photo)doctorDetails.photo = data.photo;
    await doctorDetails.save();

    const removeKeys = ["adhaarNumber", "identificationDocument", "identificationType"];
        const filteredDoctorDetails = Object.fromEntries(
          Object.entries(doctorDetails._doc).filter(([key]) => !removeKeys.includes(key))
        );


    res.status(200).json(filteredDoctorDetails);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const getDoctorDetails = async (req, res) => {
  const { doctorID } = req.body;
  if (!doctorID) {
    return res.status(400).json({ message: "Please enter doctorID" });
  }
  try {
    const doctorDetails = await doctor.findOne({ doctorID }).select("name email phone clinicPhoneNumber clinicAddress photo speciality doctorID");
    if (!doctorDetails) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctorDetails);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const approveAppointment = async (req, res) => {
  const { appointmentID, date } = req.body;

  if (!appointmentID) {
    return res.status(400).json({ message: "Please enter appointmentID" });
  }
  try {
    const appointment = await Appointment.findById(appointmentID)
      .populate("doctorID", "name email clinicAddress")
      .populate("patientID", "name email");

    appointment.status = "scheduled";
    appointment.date = date;
    await appointment.save();

    confirmEmail({
      email: appointment.patientID.email,
      date: new Date(date).toDateString(),
      doctorName: appointment.doctorID.name,
      patientName: appointment.patientID.name,
      address: appointment.doctorID.clinicAddress,
    });

    res.status(200).json(appointment);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};



export const verifyDoctor = async (req, res) => {
  const { doctorID, email } = req.body;
  try {
    const user = await doctor.findOne({ doctorID: doctorID });
    console.log(user);
    if (user?.email === email) {
      return res.status(200).json({ message: "Doctor found" });
    }
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Error" });
  }
};

export const veryExistingDoctor = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await doctor.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Doctor found" });
    }
    return res.status(200).json({ message: "" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Error" });
  }
};

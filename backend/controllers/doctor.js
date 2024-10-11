import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import doctor from "../models/Doctor.js";
import Patient from "../models/User.js";
import { appointmentEmail, confirmEmail } from "./email.js";
import jsPDF from 'jspdf';
import CryptoJS from 'crypto-js';

export const getdoctor = async (req, res) => {
    try {
        const doctorList = await doctor.find();
        if(doctorList.length === 0){
            return res.status(400).json({message: "No doctor found"});
        }
        else{
            res.status(200).json(doctorList);
        }
    } catch (error) {
        res.json({message: "Try Again after Some Time"});
        console.log(error);
    }

}

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
      user: "medid.helpdesk@gmail.com", // your email
      pass: "yrrr vsfj dxiv gkdr", // your email password
    },
  });

export const updateDoctorDetails = async (req, res) => {
    const {  name , email ,phone ,clinicPhoneNumber , clinicAddress,photo} = req.body.data;
    const {doctorID} = req.body;
    // console.log(req.body);
   
    if (!doctorID) {
        return res.status(400).json({ message: "Please enter doctorID" });
    }
    
    if (!name || !email || !phone || !clinicPhoneNumber || !clinicAddress || !photo) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const doctorDetails = await doctor.findOne({doctorId:doctorID});
        if(!doctorDetails){
            return res.status(400).json({message: "Doctor not found"});
        }
        doctorDetails.name = name;
        doctorDetails.email = email;
        doctorDetails.phone = phone;
        doctorDetails.clinicPhoneNumber = clinicPhoneNumber;
        doctorDetails.clinicAddress = clinicAddress;
        doctorDetails.photo = photo;
        await doctorDetails.save();
        res.status(200).json(doctorDetails);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}


export const getDoctorDetails = async (req, res) => {
    const { doctorID } = req.body;
    if(!doctorID){
        return res.status(400).json({message: "Please enter doctorID"});
    }
    try {
        const doctorDetails = await doctor.findOne({doctorId:doctorID});
        if(!doctorDetails){
            return res.status(400).json({message: "Doctor not found"});
        }
        res.status(200).json(doctorDetails);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}


export const recordAppointment = async (req, res) => {
    const { appointmentID , symptoms , notes , prescription ,patientName , diagnosis} = req.body;
    console.log(req.body);
    if(!appointmentID){
        return res.status(400).json({message: "Please enter appointmentID"});
    }
    try {
        const objectid  = new mongoose.Types.ObjectId(appointmentID)
        const appointment = await Appointment.findById({_id: objectid});
        if(!appointment){
            return res.status(400).json({message: "Appointment not found"});
        }
        appointment.status = "completed";
        appointment.symptoms = symptoms;
        appointment.notes = notes;
        appointment.prescription = prescription;
        appointment.diagnosis = diagnosis;
        await appointment.save();
        await sendEmailWithPDF({data: req.body});


        

        res.status(201).json(appointment);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

import nodemailer from 'nodemailer';
import { generatePDFKitPrescriptionBuffer } from "./email.js";

// Function to send email with PDF attachment
const sendEmailWithPDF = async ({data}) => {
  // Create a transporter object using SMTP transport
  const email = data.email;
 

  // Generate the PDF as a buffer
  const pdfBuffer = await new Promise((resolve, reject) => {
    const bufferStream = generatePDFKitPrescriptionBuffer(data);
    const chunks = [];
    bufferStream.on('data', chunk => chunks.push(chunk));
    bufferStream.on('end', () => resolve(Buffer.concat(chunks)));
    bufferStream.on('error', reject);
  });

  // Define email options
  const mailOptions = {
    from: {
      name: 'MedID',
      address: 'medid.helpdesk@gmail.com'
    }, // sender address
    to: email, // recipient address
    subject: 'Your Prescription',
    text: 'Please find attached your prescription.',
    attachments: [
        {
          filename: 'Prescription.pdf',
          content: pdfBuffer,
          encoding: 'base64',
        },
      ],
  };



  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Example usage


export const scheduleappointment = async (req, res) => {

    const { doctorID, patientID,date, email , patientName , address , doctorName} = req.body;
    console.log( "body")
    if(!doctorID || !patientID){
        return res.status(400).json({message: "Please enter doctorID and patientID"});
    }
    const date1 = new Date();
    try {
        const appointment = new Appointment({
            doctorID,
            patientID,
            date: date
        });
        (await appointment.populate('doctorId')).save();
try{

   await appointmentEmail({email, date,  doctorName, patientName,address})
}
catch(err){
    console.log(err)
}

        res.status(201).json({appointmentId : appointment._id , });
    } catch (error) {
        res.json(error)
    }
}

export const getAppointmentDetails = async (req, res) => {
    const { appointmentID} = req.body;
    // console.log(appointmentID ,"appointmentID");
    if(!appointmentID){
        return res.status(400).json({message: "Please enter appointmentID"});
    }
    try {
        const objectid  = new mongoose.Types.ObjectId(appointmentID)
        console.log("HERE")
        const appointment = await Appointment.findById({_id: objectid});

        const doctorDetails = await doctor.findOne({ doctorID : appointment.doctorID.toString() });
        if(!appointment){
            return res.status(400).json({message: "Appointment not found"});
        }
        
        // console.log(doctorDetails);
        res.status(200).json({appointment , doctorDetails});
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

export const getAppointment = async (req, res) => {
  

    try {
        const appointment = await Appointment.find({

        });

        const newData = await Promise.all(  appointment.map(async (data) => {
            try{
                if(data.status === "completed" || data.status === "cancelled")
                    return;
                const doctorDetails = await doctor.findOne({ doctorID : data.doctorID });
                const patientDetails = await Patient.findOne({ patientID : data.patientID.toString() });
                return {appointment: data, doctorDetails , patientDetails};
            }
            catch(e){
                console.log(e);
            }
        }));
        res.status(200).json(newData);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}
export const getDocAppointment = async (req, res) => {

    const data = req.body;
    console.log(req.body);
  

    try {
        const appointment = await Appointment.find({
            patientID: data.patientID ,
        });

        const newData = await Promise.all(  appointment.map(async (data) => {
            try{

                const doctorDetails = await doctor.findOne({ doctorId : data.doctorID });

               return  {appointment: data, doctorDetails};
            }
            catch(e){
                console.log(e);
            }}));
                

       
        res.status(200).json(newData);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

export const approveAppointment = async (req, res) => {
    const { appointmentID ,date} = req.body;
    if(!appointmentID){
        return res.status(400).json({message: "Please enter appointmentID"});
    }
    try {
        const objectid  = new mongoose.Types.ObjectId(appointmentID)
        const appointment = await Appointment.findById({_id: objectid});
        if(!appointment){
            return res.status(400).json({message: "Appointment not found"});
        }
        appointment.status = "scheduled";
        appointment.date = date;
        await appointment.save();

        // confirmEmail({ email, date, time : date, doctorName, patientName,address })
        res.status(200).json(appointment);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

export const cancelAppointment = async (req, res) => {
    const { appointmentID } = req.body;
    if(!appointmentID){
        return res.status(400).json({message: "Please enter appointmentID"});
    }
    try {
        const objectid  = new mongoose.Types.ObjectId(appointmentID)
        const appointment = await Appointment.findById({_id: objectid});
        if(!appointment){
            return res.status(400).json({message: "Appointment not found"});
        }
        appointment.status = "cancelled";
        await appointment.save();
        res.status(200).json(appointment);
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

export const getAppointmentByPatient = async (req, res) => 
    {
        const { patientID } = req.body;
        if(!patientID){
            return res.status(400).json({message: "Please enter patientID"});
        }
        try {
            const appointment = await Appointment.find({patientID});
            if(appointment.length === 0){
                return res.status(400).json({message: "No appointment found"});
            }
            const newData = await Promise.all(  appointment.map(async (data) => {
                try{
                    const doctorDetails = await doctor.findOne({ doctorId : data.doctorID });
                    
                    const patientDetails = await Patient.findOne({ patientID : data.patientID.toString() });
                    return {appointment: data, doctorDetails : doctorDetails.name , patientDetails : patientDetails.name};
                }
                catch(e){
                    console.log(e);
                }
            }));
            res.status(200).json(newData);
        } catch (error) {
            res.json(error);
            console.log(error);
        }
    }


    export const  verifyDoctor = async (req, res) => {
        const { doctorID , email } = req.body;
        console.log(req.body);
        try{
            const user = await doctor.findOne({doctorId:doctorID});
            console.log(user)
            if(user?.email === email){
                return res.status(200).json({ message : "Doctor found"});
            }
            return res.status(400).json({ message : "Invalid Credentials"});
        }
        catch (error) {
            console.log(error);
            res.status(403).json({message : "Error"});
        }
    }


    export const veryExistingDoctor = async (req, res) => {
        const { email } = req.body;
        try{
            const user = await doctor.findOne({email});
            if(user){
                return res.status(400).json({ message : "Doctor found"});
            }
            return res.status(200).json({ message : ""});
        }
        catch (error) {
            console.log(error);
            res.status(403).json({message : "Error"});
        }
    }


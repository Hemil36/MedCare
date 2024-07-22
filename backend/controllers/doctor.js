import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";
import doctor from "../models/Doctor.js";

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

export const scheduleappointment = async (req, res) => {

    const { doctorID, userID} = req.body;
    if(!doctorID || !userID){
        return res.status(400).json({message: "Please enter doctorID and userID"});
    }
    const date1 = new Date();
    try {
        const appointment = new Appointment({
            doctorID,
            userID,
            date: date1
        });
        (await appointment.populate('doctorID')).save();

        res.status(201).json(appointment._id);
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
        const appointment = await Appointment.findById({_id: objectid});

        const doctorDetails = await doctor.findOne({ doctorID : appointment.doctorID.toString() });
        console.log(doctorDetails);
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
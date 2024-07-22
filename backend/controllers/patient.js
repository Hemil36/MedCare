import Appointment from "../models/AppointmentRecord";
import doctor from "../models/Doctor";
import Patient from "../models/User";

export const scheduleappointment = async (req, res) => {
//   const {
//     doctorID,
//     userID
// } = req.body;

console.log(req.body)
//   try {

//     const doctor = doctor.findOne({doctorID});
//     const user = Patient.findOne({userID});
//     if(!doctor){
//       return res.status(400).json({message: "Doctor does not exist"});
//     }
//     if(!user){
//       return res.status(400).json({message: "User does not exist"});
//     }
//     const appointment = new Appointment({
//       doctorID,
//       userID,
//       date 
//     });
//     await appointment.save().then((result) => {
//         console.log(result)
//     }).catch((err) => console.log(err));
//     res.status(201).json(appointment);
//   } catch (error) {
//     console.log(error);
//   }
}
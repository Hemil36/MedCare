import Appointment from "../models/AppointmentRecord.js";
import Patient from "../models/User.js";
import sendEmail from "./email.js";
import getPersonalizedMessage from "./gemini.js";

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);
    return { start: tomorrow, end: endOfTomorrow };
  };
  
const reminder = async (req, res) => {
    const { start, end } = getTomorrow(); // Get the start and end of tomorrow
    
    const appointments = await Appointment.find({
      date: { $gte: start, $lt: end } // Appointments between midnight and the end of the day tomorrow
    });
  
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments for tomorrow.' });
    }

    
    // For each appointment, send a personalized email
    for (let appointment of appointments) {
        const patient = await Patient.findOne({patientID: appointment.patientID});
        console.log(patient)
        try {
        const personalizedMessage = await getPersonalizedMessage( {
          date: appointment.date,
            name: patient.name,
        });

        console.log(patient.email)
  
        await sendEmail(patient.email, 'Appointment Reminder', personalizedMessage);
      } catch (error) {
        console.error('Error sending reminder email:', error);
      }
    }
  
    res.status(200).json({ message: 'Reminders sent for tomorrow\'s appointments' });
  };


export default reminder;
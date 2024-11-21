import mongoose from "mongoose";
import Appointment from "../models/AppointmentRecord.js";

const cron = async() => {
    await mongoose.connect("mongodb+srv://hemildudhat04:hemil04@cluster0.ifcde31.mongodb.net/PatientManagement?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log("Database connected successfully");
      }).catch((err) => {
          console.log(err);
      });
      
  
    try{
        const currentTime = new Date();

        const result = await Appointment.deleteMany({
          date: { $lt: currentTime },
          status: { $in: ['pending', 'cancelled','scheduled'] },
        });
    
      
          console.log( `${result.deletedCount} expired appointments deleted.`)
   
      } catch (err) {
        console.error('Error deleting expired appointments:', err);
      } 
    
}


cron();
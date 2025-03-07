import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "medid.helpdesk@gmail.com", 
    pass: process.env.GMAIL_PASSWORD, 
  }
});




export default transporter;

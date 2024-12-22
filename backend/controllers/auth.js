import User from "../models/User.js";
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid";
import { customAlphabet } from "nanoid";
import nodemailer from "nodemailer";
import Patient from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { createAccountDoctorEmail, createAccountEmail, forgotemail } from "./email.js";

const id = nanoid(10);

export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
    }
    next()
}

export const forgotID = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne ( { email  });
      const doctor = await Doctor.findOne ( {email  });
      if (!user || !doctor) {
        return res.status(400).json({ message: 'User not found' });
      }

      if(user){
        await forgotemail({id: user.patientID, name: user.name, email});
      }
      if(doctor){
        await forgotemail({id: doctor.doctorId, name: doctor.name, email});
      }

      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.log(error);
      res.status(403).json({ error });
    }
  }

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
      user: "medid.helpdesk@gmail.com", // your email
      pass: "yrrr vsfj dxiv gkdr", // your email password
    },
  });

  function generateOtpEmailTemplate(otp) {
    return  `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email</title>
  <style>
    /* Default body and HTML background styling */
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background-color: #000000 !important; /* Forcing black background */
    }

    /* Ensure email takes up full screen width and height */
    table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
    }

    /* Email container styles */
    .email-container {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      background-color: #252525;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .header {
      background-color: #252525;
      padding: 24px;
      position: relative;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      color: #FFFFFF;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .header-accent {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #3ECF8E, #3ECFCF);
    }

    .content {
      padding: 40px 32px;
    }

    .heading {
      color: #FFFFFF;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 16px;
      text-align: center;
      letter-spacing: -0.5px;
    }

    .paragraph {
      color: #FFFFFF;
      font-size: 16px;
      line-height: 24px;
      margin: 0 0 32px;
      text-align: center;
    }

    .otp-container {
      background: linear-gradient(135deg, #3ECF8E, #3ECFCF);
      border-radius: 12px;
      margin: 0 auto 24px;
      padding: 24px;
      text-align: center;
      max-width: 240px;
      box-shadow: 0 4px 12px rgba(62, 207, 142, 0.2);
    }

    .otp-text {
      color: #FFFFFF;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .expiration-text {
      color: #FFFFFF;
      font-size: 14px;
      text-align: center;
      margin: 0 0 32px;
    }

    .highlight {
      color: #3ECF8E;
      font-weight: 600;
    }

    /* Footnote styles */
    .footnote-container {
      border-top: 1px solid #E0E0E0;
      margin-top: 32px;
      padding-top: 24px;
    }

    .footnote {
      color: #FFFFFF;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      margin: 0;
    }

    /* Footer styles */
    .footer {
      background-color: #252525;
      padding: 16px 24px;
      text-align: center;
    }

    .footer-text {
      color: #FFFFFF;
      font-size: 12px;
      margin: 0;
    }
  </style>
</head>
<body style="background-color: #000000; margin: 0; padding: 0;">
  <!-- Table wrapper to ensure full email background -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; width: 100%; height: 100%; padding: 0; margin: 0;">
    <tr>
      <td align="center" valign="top" style="padding: 40px;">
        <div class="email-container">
          <div class="header">
            <div class="logo-container">
              <p class="logo">MedID</p>
            </div>
            <div class="header-accent"></div>
          </div>
          <div class="content">
            <h1 class="heading">Your One-Time Password</h1>
            <p class="paragraph">
              Enter the following OTP to complete your action:
            </p>
            <div class="otp-container">
              <p class="otp-text">${otp}</p>
            </div>
            <p class="expiration-text">
              This OTP expires in <span class="highlight">10 minutes</span>
            </p>
            <div class="footnote-container">
              <p class="footnote">
                If you didn't request this code, please ignore this email or contact our support team if you have any concerns.
              </p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">© 2024 MedID. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>

`;
  }

export const OTPSender = async (req,res) => {
    const alphabet = '0123456789';
    const nanoid = customAlphabet(alphabet, 6);
    const otp = nanoid();const { email } = req.body;
    // console.log(email);

    const mailOptions = {
        from: {
          name: 'MedID',
          address: 'medid.helpdesk@gmail.com'
        }, // sender address
        to: email, // recipient address
        subject: 'Your OTP for Login',
        html: generateOtpEmailTemplate(otp),
      };

      res.app.locals.OTP = otp;
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.json({ message: 'OTP sent successfully' });
        console.log('Message sent: %s', info.messageId);
      })
} 


export const verifyOTP = async (req,res)=>{
    const { otp } = req.body;
   
    if(parseInt(req.app.locals.OTP) === parseInt(otp)){
        req.app.locals.OTP = null; // reset the OTP value
        console.log("OTP verified successfully");
        return res.status(201).json({ msg: 'Verify Successsfully!'})
    }

    return res.status(400).json({ error: "Invalid OTP"});
}



export const login = async (req, res) => {
   
    
    try{

        const {patientID , email} = req.body;
        
        const patient = await User.findOne({patientID , email});

        if(!patient){
            return res.status(400).json({ message : "User not found"});
        }
        const accesstoken = jwt.sign({patientID: patient.patientID , name: patient.name}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '1hr'});
        const refreshtoken = jwt.sign({patientID: patient.patientID , name: patient.name}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '10hr'});

        res.cookie('jwt', refreshtoken, { httpOnly: true , secure: true , sameSite: 'none'});
        return  res.status(200).json({ accesstoken , patientID : patient.patientID , name:patient.name});


    }
    catch (error) {
      console.log(error);

    }
}
export const loginDoctor = async (req, res) => {
  try{

    const {doctorID , email} = req.body;
    console.log(doctorID , email);
    
    const doctor = await Doctor.findOne({doctorId:doctorID});
    


    if(!doctor){
        return res.status(400).json({ message : "Doctor not found"});
    }
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    const accesstoken = jwt.sign({doctorID: doctor.doctorID , name: doctor.name}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '60s'});
    const refreshtoken = jwt.sign({doctorID: doctor.doctorID , name: doctor.name}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '9hr'});

    res.cookie('jwt', refreshtoken, { httpOnly: true , secure: true , sameSite: 'none'});
  return  res.status(200).json({ accesstoken , doctorID : doctor.doctorID , name:doctor.name});


}
catch (error) {
  console.log(error);

}}

 function generateCustomId() {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 16);
const randomString = nanoid();



    const formattedId = `${randomString.slice(0, 4)}-${randomString.slice(4, 8)}-${randomString.slice(8, 12)}`;

    return formattedId;
}

export const register = async (req, res) => {

    const {
       
        type
        
      } = req.body;

      const { name,
        email,
        phone,
        birthDate,
        gender,
        emergencyContactName,
        emergencyPhone,
        currentMedication,
        pastMedicalHistory,
        identificationType,
        adhaarNumber,
        identificationDocument} = req.body.data
      
      if(type == "doctor"){
        return registerDoctor(req, res);
      }
    
    try{

        
        const user = await User.findOne({email }) || await User.findOne({phone}) || await User.findOne({adhaarNumber});
        if(user){
            return res.status(400).json({ message : "User already exist"});
        }
        const patientID = generateCustomId();
        const newUser = new User({ name , email , phone, gender  , patientID , adhaarNumber , currentMedication , pastMedicalHistory , identificationDocument , emergencyContactName , emergencyPhone});
        await newUser.save();
        await createAccountEmail({patientID, patientName: name, email});

        res.status(201).json({message: "User registered successfully" , patientID });
    } catch (error) {
        res.status(403).json({error :"Error"});
        console.log(error);
    }
    }


    export const registerDoctor = async (req, res) => {
        const {
          name,
          email,
          phone,
          birthDate,
          gender,
          emergencyContactName,
          clinicPhoneNumber,
          councilID,
          speciality,
          graduationYear,
          degree,
          colleage,
          identificationType,
          adhaarNumber,
          identificationDocument , clinicaddress,
          photo
         } = req.body.data;

        try {
          const doctor = await Doctor.findOne({councilID}) ;
          console.log(doctor);
          if (doctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
          }
          const nanoid = customAlphabet('1234567890abcdef', 4)
          const doctorId = "DOC"+nanoid(); 
          const newDoctor = new Doctor({
            name,
            email,
            phone,
            birthDate,
            gender,
            emergencyContactName,
            clinicPhoneNumber,
            councilID,
            speciality,
            graduationYear,
            qualification : degree,
            colleage,
            identificationType,
            adhaarNumber,
            identificationDocument,
            doctorId,
            clinicAddress: clinicaddress,
            photo
          });
          await newDoctor.save();

          await createAccountDoctorEmail({ doctorId, doctorName:name, email});

          res.status(201).json({ message: 'Doctor registered successfully', doctorId });

        } catch (error) {
          res.status(403).json({ error: 'Error' });
          console.log(error);
        }



    }

    export const verifyUser = async (req, res) => {
        const { patientID , email } = req.body;
        // console.log(patientID , email);
        try{
            const user = await Patient.findOne({patientID , email});
            // console.log(user)
            if(!user){
                return res.status(400).json({ message : "User not found"});
            }
            return res.status(200).json({ message : "User found"});
          }
          catch (error) {
            res.status(403).json({error});
          }
    }

    


 export   const handleRefreshToken = async (req, res) => {
    
        const cookies = req.cookies;
        // console.log(cookies)
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
    

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                // console.log(decoded)
                if(err) return res.status(402).json({message : "Refresh token Invalid"});
                
                const accessToken = jwt.sign(
                    { patientID: decoded.patientID , name: decoded.name},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1hr' }
                );
                res.json({ accessToken })
            }
        );
    }

    export const logout = async (req, res) => {
        res.clearCookie('jwt');
        res.json({ message: 'Logged out' });
    }
    
    export default  handleRefreshToken 
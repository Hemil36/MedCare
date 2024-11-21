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
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Your OTP for Login</h2>
        <p>Hello,</p>
        <p>Use the following OTP to log in to your account:</p>
        <p style="font-size: 24px; font-weight: bold;">${otp}</p>
        <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
        <p>Thank you,</p>
        <p>Your Company Name</p>
      </div>
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

    const {doctorId , email} = req.body;
    // console.log(doctorId , email);
    
    const patient = await User.findOne({doctorId , email});

    if(!patient){
        return res.status(400).json({ message : "User not found"});
    }
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    const accesstoken = jwt.sign({doctorId: patient.doctorId , name: patient.name}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '60s'});
    const refreshtoken = jwt.sign({doctorId: patient.doctorId , name: patient.name}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '9hr'});

    res.cookie('jwt', refreshtoken, { httpOnly: true , secure: true , sameSite: 'none'});
  return  res.status(200).json({ accesstoken , doctorId : patient.doctorId , name:patient.name});


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
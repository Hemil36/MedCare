import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
      user: "medid.helpdesk@gmail.com", // your email
      pass: "yrrr vsfj dxiv gkdr", // your email password
    },
  });

  export const appointmentEmail = ({ email, date,  doctorName, patientName,address }) => {
    console.log("email sent")
    const date1 = new Date(date)
const html =({email, date,  doctorName, patientName,address})=>{
    return(
        `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <div style="margin-top: 20px;">
            <h1 style="font-size: 24px; color: #333;">Appointment Request Received - ${date1.toDateString()}</h1>
            <p>Dear ${patientName},</p>
            <p>Thank you for requesting an appointment with Medid. We have received your request and will confirm the appointment soon. Please find the details of your request below:</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                <p><strong>Appointment Request Details:</strong></p>
                <p><strong>Requested Date:</strong> ${date1.toDateString()}</p>
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Location:</strong> ${address}</p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <p> ${doctorName} will confirm the appointment as soon as possible. You will receive a follow-up email once your appointment is confirmed. If the requested time is not available, we will offer alternative slots for your convenience.</p>
            <p>Thank you for choosing Medid. We look forward to assisting you with your healthcare needs.</p>
            <p>Please note that this is an automated email. Do not reply to this email directly.</p>
            </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
            <p>Best Regards,</p>
            <p>Medid</p>
        </div>
    </div>
</body>`
    )
}
    const mailOptions = {
        from: {
          name: 'MedID',
          address: 'medid.helpdesk@gmail.com'
        }, // sender address
        to: email, // recipient address
        subject: 'Appointment Request Received',
        html: html({email, date,  doctorName, patientName,address}),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      })


  }

  export const confirmEmail =  ({ email, date, time, doctorName, patientName,address }) => {
    
const html =({email, date, time, doctorName, patientName,address})=>{
    return(
       `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
        </div>
        <div style="margin-top: 20px;">
            <h1 style="font-size: 24px; color: #333;">Appointment Confirmation - ${date}</h1>
            <p>Dear ${patientName},</p>
            <p>We are pleased to confirm your appointment with Medid. Please find the details of your confirmed appointment below:</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                <p><strong>Appointment Details:</strong></p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Location:</strong> ${address}</p>
            </div>
            <p>Please arrive 10 minutes before your scheduled appointment time. If you need to reschedule or cancel, kindly do so at least 24 hours in advance by contacting us at [Contact Number] or replying to this email.</p>
          
            <p>If you have any questions or need further assistance, please feel free to contact our support team at [Support Email] or call us at [Support Phone Number].</p>
            <p>We look forward to seeing you.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
            <p>Best Regards,</p>
            <p>Medid</p>
        </div>
    </div>
</body>`
    )
}
    const mailOptions = {
        from: {
          name: 'MedID',
          address: 'medid.helpdesk@gmail.com'
        }, // sender address
        to: email, // recipient address
        subject: 'Appointment Request Received',
        html: html({email, date, time, doctorName, patientName,address}),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.json({ message: 'OTP sent successfully' });
        console.log('Message sent: %s', info.messageId);
      })


  }


  export const recordEmail = async (req,res) => {
    const { email , patientName} = req.body;

    const html = ()=>{
        return `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
            <img src="[Company Logo URL]" alt="Medid" style="width: 150px;">
        </div>
        <div style="margin-top: 20px;">
            <h1 style="font-size: 24px; color: #333;">Medical Records Created</h1>
            <p>Dear ${patientName},</p>
            <p>We are pleased to inform you that your medical records have been successfully created. </p>
           
            <p>If you have any questions or need further assistance, please feel free to contact our support team at [Support Email] or call us at [Support Phone Number].</p>
            <p>We appreciate your trust in Medid and look forward to continuing to serve your healthcare needs.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
            <p>Medid</p>
        </div>
    </div>
</body>`
    } 
  }

  export const createAccountEmail = ({patientID,patientName,email})=>{
       
const html =({ patientName,patientID})=>{
    return(
       `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
       
        <div style="margin-top: 20px;">
            <h1 style="font-size: 24px; color: #333;">Account Created Successfully</h1>
            <p>Dear ${patientName},</p>
            <p>We are pleased to inform you that your account has been successfully created. Please find the details of your account below:</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                <p><strong>Account Details:</strong></p>
               <p><strong>Account ID:</strong> ${patientID}</p>
            </div>
            <p>You can now log in to your account using your medID.</p>
            <p>Thank you for choosing Medid. We look forward to serving you.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
           
            <p>Medid</p>
        </div>
    </div>
</body>`
    )
}
    const mailOptions = {
        from: {
          name: 'MedID',
          address: 'medid.helpdesk@gmail.com'
        }, // sender address
        to: email, // recipient address
        subject: 'MedID Account Created',
        html: html({ patientName,patientID}),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      })

  }



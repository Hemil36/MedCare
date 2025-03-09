import PDFDocument from "pdfkit";
import CryptoJS from "crypto-js";
import { PassThrough } from "stream";
import transporter from "../services/email.js";

export const appointmentEmail = ({ email, date, doctorName, patientName, address }) => {
  console.log("email sent")
  console.log(email, date, doctorName, patientName, address)
  const date1 = new Date(date)
  const html = ({ email, date, time, doctorName, patientName, address }) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background-color: #000000 !important;
    }

    table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
    }

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

    .details-container p {
      color: #FFFFFF;
      font-size: 16px;
      margin: 0 0 8px;
      text-align: center;
    }

    .highlight {
      color: #3ECF8E;
      font-weight: 600;
    }

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
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; width: 100%; height: 100%; padding: 0; margin: 0;">
    <tr>
      <td align="center" valign="top" style="padding: 40px;">
        <div class="email-container">
          <div class="header">
            <div class="logo-container">
              <p class="logo">MedCare</p>
            </div>
            <div class="header-accent"></div>
          </div>
          <div class="content">
            <h1 class="heading">Appointment Confirmed</h1>
            <p class="paragraph">
              Dear <span class="highlight">${patientName}</span>, your appointment is confirmed. Below are the details:
            </p>
            <div class="details-container">
              <p><strong>Doctor:</strong> ${doctorName}</p>
              <p><strong>Date:</strong> ${date1.getDate()}  ${date1.getTime()}</p>
              <p><strong>Location:</strong> ${address}</p>
            </div>
            <p class="paragraph">
              If you have any questions, please reach out to us at <span class="highlight">medid.helpdesk@gmail.com</span>.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">© 2025 MedCare. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`
  };


  const mailOptions = {
    from: {
      name: 'MedCare',
      address: 'MedCare.helpdesk@gmail.com'
    }, // sender address
    to: email, // recipient address
    subject: 'Appointment Request Received',
    html: html({ email, date, doctorName, patientName, address }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  })

}
export const confirmEmail = ({
  email,
  date,
  time,
  doctorName,
  patientName,
  address,
}) => {
const date1 = new Date(date)
  const html = ({ email, date, time, doctorName, patientName, address }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
            /* Default body and HTML background styling */
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                background-color: #252525 !important; /* Changed to match email container */
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
                box-shadow: 0 4px 12px rgba(62, 207, 142, 0.2);
            }

            .otp-text {
                color: #FFFFFF;
                font-size: 36px;
                font-weight: 700;
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
    <body>
        <div class="email-container">
            <div class="header">
                <h1 class="logo">Appointment Confirmation</h1>
                <div class="header-accent"></div>
            </div>
            <div class="content">
                <h2 class="heading">Dear ${patientName},</h2>
                <p class="paragraph">We are delighted to confirm your appointment with MedCare. Here are the appointment details:</p>
                <div class="otp-container">
                    <p class="otp-text">Date : ${date1.toLocaleDateString()}</p>
                    <p class="otp-text">Time : ${date1.toLocaleTimeString()}</p>
                </div>
                <p class="paragraph"><strong>Doctor:</strong> ${doctorName}</p>
                <p class="paragraph"><strong>Location:</strong> ${address}</p>
                <p class="paragraph">Please arrive 10 minutes early and contact support for changes.</p>
                <p class="paragraph highlight">For inquiries: medid.helpdesk@gmail.com</p>
            </div>
            <div class="footer">
                <p class="footer-text">Best Regards,</p>
                <p class="footer-text">MedCare Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "medCare.helpdesk@gmail.com",
    }, // sender address
    to: email, // recipient address
    subject: "Appointment Request Confirmed",
    html: html({ email, date, time, doctorName, patientName, address }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.json({ message: "OTP sent successfully" });
    console.log("Message sent: %s", info.messageId);
  });
};



export const recordEmail = async ({ patientName, email }) => {
  const medicalRecordsCreatedEmail = ({ patientName }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Records Created</title>
        <style>
            /* Default body and HTML background styling */
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                background-color: #252525 !important; /* Changed to match email container */
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

            .highlight {
                color: #3ECF8E;
                font-weight: 600;
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
    <body>
        <div class="email-container">
            <div class="header">
                <div>
          <h1 className=" text-left text-2xl font-bold ">
            MedCare
          </h1>
        </div>
        <div className="relative">

        <div className="h-2 w-2  rounded-full bottom-1 absolute   bg-green-400" />
        </div>
                <div class="header-accent"></div>
            </div>
            <div class="content">
                <h2 class="heading">Medical Record Created</h2>
                <p class="paragraph">Dear ${patientName},</p>
                <p class="paragraph">We are pleased to inform you that your medical record have been successfully created on MedCare Locker.</p>
                <p class="paragraph">If you have any questions or need further assistance, please feel free to contact our support team at <span class="highlight">medid.helpdesk@gmail.com</span> </p>
                <p class="paragraph">We appreciate your trust in MedCare and look forward to continuing to serve your healthcare needs.</p>
            </div>
            <div class="footer">
                <p class="footer-text">MedCare</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "medCare.helpdesk@gmail.com",
    },
    to: email, // recipient address
    subject: "Medical Records Created",
    html: medicalRecordsCreatedEmail({ patientName }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.json({ message: "Record Email" });
    console.log("Message sent: %s", info.messageId);
  });
};




export const createAccountEmail = ({ patientID, patientName, email }) => {
  const html = ({ patientName, patientID }) => {
   
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Records Created</title>
        <style>
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
              <p class="logo">MedCare</p>
            </div>
            <div class="header-accent"></div>
          </div>
          <div class="content">
                <h2 class="heading">Account Created Successfully</h2>
                <p class="paragraph">Dear ${patientName},</p>
                <p class="paragraph">We are pleased to inform you that your account has been successfully created. Below are the details:</p>
                <div class="otp-container">
                    <p class="otp-text"><strong>MedID:</strong> ${patientID}</p>
                </div>
                <p class="paragraph">You can now log in to your account using your MedID.</p>
                <p class="paragraph">We appreciate your trust in MedCare and look forward to continuing to serve your healthcare needs.</p>
            <div class="footnote-container">
              <p class="footnote">
                If you didn't request this code, please ignore this email or contact our support team if you have any concerns.
              </p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">© 2025 MedCare. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
   
    </html>
    `;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "mecare.helpdesk@gmail.com",
    }, // sender address
    to: email, // recipient address
    subject: "MedCare Account Created",
    html: html({ patientName, patientID }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: ", info);
  });
};

export const createAccountDoctorEmail = ({ doctorID, doctorName, email }) => {
  const html = ({ doctorName, doctorID }) => {
   
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Records Created</title>
        <style>
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
              <p class="logo">MedCare</p>
            </div>
            <div class="header-accent"></div>
          </div>
          <div class="content">
                <h2 class="heading">Account Created Successfully</h2>
                <p class="paragraph">Dear ${doctorName},</p>
                <p class="paragraph">We are pleased to inform you that your account has been successfully created. Below are the details:</p>
                <div class="otp-container">
                    <p class="otp-text"><strong>DocID:</strong> ${doctorID}</p>
                </div>
                <p class="paragraph">You can now log in to your account using your MedID.</p>
                <p class="paragraph">We appreciate your trust in MedCare and look forward to continuing to serve your healthcare needs.</p>
            <div class="footnote-container">
              <p class="footnote">
                If you didn't request this code, please ignore this email or contact our support team if you have any concerns.
              </p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">© 2025 MedCare. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
   
    </html>
    `;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "medCare.helpdesk@gmail.com",
    }, // sender address
    to: email, // recipient address
    subject: "MedCare Account Created",
    html: html({ doctorID, doctorName }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

export const forgotemail = ({ id, name, email }) => {
  const html = ({ id, name }) => {
    return `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
           
            <div style="margin-top: 20px;">
                <h1 style="font-size: 24px; color: #333;">MedID Recovered Successfully</h1>
                <p>Dear ${name},</p>
                <p>We are pleased to inform you that your account has been successfully Recovered. Please find the details of your account below:</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <p><strong>Account Details:</strong></p>
                   <p><strong>Account ID:</strong> ${id}</p>
                </div>
                <p>You can now log in to your account using your medID.</p>
                <p>Thank you for choosing MedCare. We look forward to serving you.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
               
                <p>MedCare</p>
            </div>
        </div>
    </body>`;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "meCare.helpdesk@gmail.com",
    }, // sender address
    to: email, // recipient address
    subject: "MedID Recovered",
    html: html({ id, name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

export const cancelAppointment = async ({ email, patientName }) => {
  const html = ({ email, patientName }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancellation</title>
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

            .details-container {
                background-color: #1E1E1E;
                border-radius: 12px;
                margin: 0 auto 24px;
                padding: 24px;
                max-width: 240px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                color: #FFFFFF;
                text-align: left;
            }

            .highlight {
                color: #3ECF8E;
                font-weight: 600;
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
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; width: 100%; height: 100%; padding: 0; margin: 0;">
        <tr>
          <td align="center" valign="top" style="padding: 40px;">
            <div class="email-container">
              <div class="header">
                <div class="logo-container">
                  <div>
          <h1 className=" text-left text-2xl font-bold ">
            MedCare
          </h1>
        </div>
        <div className="relative">

        <div className="h-2 w-2  rounded-full bottom-1 absolute   bg-green-400" />
        </div>
                </div>
                <div class="header-accent"></div>
              </div>
              <div class="content">
                <h1 class="heading">Appointment Cancelled</h1>
                <p class="paragraph">
                  Dear <span class="highlight">${patientName}</span>, we regret to inform you that your appointment has been cancelled. Below are the details of the cancelled appointment:
                </p>
               
                <p class="paragraph">
                  We apologize for any inconvenience caused. If you would like to reschedule your appointment, please contact us at <span class="highlight">medid.helpdesk@gmail.com</span>.
                </p>
              </div>
              <div class="footer">
                <p class="footer-text">© 2025 MedCare. All rights reserved.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  };

  const mailOptions = {
    from: {
      name: "MedCare",
      address: "medCare.helpdesk@gmail.com",
    }, // sender address
    to: email, // recipient address
    subject: "Appointment Request Cancelled",
    html: html({ email, patientName }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

// Function to generate PDF as a buffer using PDFKit
export const generatePDFKitPrescriptionBuffer = (data) => {
  const { patientName, email, diagnosis, prescription, notes, date } = data;
  const hash = generateHash({ patientName, diagnosis, prescription });

  const doc = new PDFDocument({ margin: 40 });
  const bufferStream = new PassThrough();

  // Save the document to a buffer
  doc.pipe(bufferStream);

  // Header Section
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("MedCare", { align: "left" })
    .moveDown(0.5)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Patient: ${patientName}`, { continued: true })
    .text(`Prescription Date: ${date}`, { align: "right" })
    .text(`Email: ${email}`, { continued: true })
    // .text(`Consultation Time: 11:32AM`, { align: 'right'  })
    .moveDown(1)
    .fontSize(10);

  doc.moveDown(1);

  // Diagnosis Section
  doc
    .fontSize(14)
    .fillColor("#2b5797")
    .text(`DIAGNOSIS: ${diagnosis.toUpperCase()}`, { underline: true })
    .moveDown(1);

  // Table Header
  let tableTop = doc.y; // Store initial Y position of the table

  doc
    .fontSize(10)
    .fillColor("#0a58ca") // Blue color for header
    .text("#", 50, tableTop) // First column at X=50
    .text("Medication", 100, tableTop) // Second column at X=100
    .text("Dose", 250, tableTop) // Third column at X=250
    .text("Frequency", 330, tableTop) // Fourth column at X=330
    .text("Duration", 420, tableTop); // Fifth column at X=420

  doc.moveDown(0.5); // Move down after the header

  // Table Rows (use same y-position for each row)
  prescription.forEach((med, index) => {
    let rowY = doc.y; // Store Y position for the row

    doc
      .fontSize(10)
      .fillColor("#333") // Dark gray for table data
      .text(`${index + 1}`, 50, rowY) // First column (index)
      .text(med.name, 100, rowY) // Second column (medication)
      .text(med.dose, 250, rowY) // Third column (dose)
      .text(med.frequency, 330, rowY) // Fourth column (frequency)
      .text(med.duration, 420, rowY); // Fifth column (duration)

    doc.moveDown(0.5); // Move down after each row
  });

  doc.moveDown(1);

  // Remarks Section

  // Remarks Section
  // notes.forEach((med, index) => {
  //   doc
  //     .fontSize(10)
  //     .fillColor('#555')
  //     .moveDown(0.5)
  //     .text(`Remarks: ${med.remarks}`);
  // });

  // Follow-up Information

  // Footer Section
  // doc
  //   .fontSize(10)
  //   .fillColor('#666')
  //   .moveDown(1)
  //   .text('This is a digitally generated prescription.', { align: 'center' })
  //   .text(`Digital Signature: ${hash}`, { align: 'center' });
  //   doc.moveDown(1);

  // Remarks Section
  doc.moveDown(1);
  let text4 = ` Remarks: ${notes}`;
  const pageWidth5 = doc.page.width; // Get the page width

  let text4Width = doc.widthOfString(text4);
  doc.text(text4, (pageWidth5 - text4Width) / 2); // Lighter gray for remarks

  doc.moveDown(1);

  // Footer Section
  const pageWidth = doc.page.width; // Get the page width

  // Center "This is a digitally generated prescription."
  let text1 = "This is a digitally generated prescription.";
  let text1Width = doc.widthOfString(text1);
  doc.text(text1, (pageWidth - text1Width) / 2); // Center by calculating x position

  // Center "Digital Signature: some-hash-value"
  let text2 = `Digital Signature: ${hash}`;
  let text2Width = doc.widthOfString(text2);
  doc.text(text2, (pageWidth - text2Width) / 2);

  // Finalize PDF and end the stream
  // Finalize PDF
  doc.end();

  return bufferStream;
};

// Hash generation function
const generateHash = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
};

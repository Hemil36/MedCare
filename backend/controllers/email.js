import PDFDocument from "pdfkit";
import CryptoJS from "crypto-js";
import { PassThrough } from "stream";
import transporter from "../services/email.js";

/**
 * Shared email styling constants
 */
const EMAIL_STYLES = {
  CONTAINER_BG: "#252525",
  TEXT_COLOR: "#FFFFFF",
  ACCENT_COLOR: "#3ECF8E",
  GRADIENT: "linear-gradient(90deg, #3ECF8E, #3ECFCF)",
};

/**
 * Base email template with common styling
 * @param {Object} options - Template options
 * @returns {String} - HTML email template
 */
const baseEmailTemplate = ({ title, header, content, footer = "© 2025 MedCare. All rights reserved." }) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
        background-color: ${EMAIL_STYLES.CONTAINER_BG};
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      }
      
      .header {
        background-color: ${EMAIL_STYLES.CONTAINER_BG};
        padding: 24px;
        position: relative;
      }
      
      .logo-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .logo {
        color: ${EMAIL_STYLES.TEXT_COLOR};
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
        background: ${EMAIL_STYLES.GRADIENT};
      }
      
      .content {
        padding: 40px 32px;
      }
      
      .heading {
        color: ${EMAIL_STYLES.TEXT_COLOR};
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 16px;
        text-align: center;
        letter-spacing: -0.5px;
      }
      
      .paragraph {
        color: ${EMAIL_STYLES.TEXT_COLOR};
        font-size: 16px;
        line-height: 24px;
        margin: 0 0 32px;
        text-align: center;
      }
      
      .highlight {
        color: ${EMAIL_STYLES.ACCENT_COLOR};
        font-weight: 600;
      }
      
      .footer {
        background-color: ${EMAIL_STYLES.CONTAINER_BG};
        padding: 16px 24px;
        text-align: center;
      }
      
      .footer-text {
        color: ${EMAIL_STYLES.TEXT_COLOR};
        font-size: 12px;
        margin: 0;
      }
      
      .otp-container {
        background: ${EMAIL_STYLES.GRADIENT};
        border-radius: 12px;
        margin: 0 auto 24px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(62, 207, 142, 0.2);
      }
      
      .otp-text {
        color: ${EMAIL_STYLES.TEXT_COLOR};
        font-size: 36px;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .footnote-container {
        border-top: 1px solid #E0E0E0;
        margin-top: 32px;
        padding-top: 24px;
      }
      
      .footnote {
        color: ${EMAIL_STYLES.TEXT_COLOR};
        font-size: 14px;
        line-height: 20px;
        text-align: center;
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
              ${content}
            </div>
            <div class="footer">
              <p class="footer-text">${footer}</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
};

/**
 * Send email with proper error handling
 * @param {Object} mailOptions - Email options
 * @returns {Promise} - Result of email sending
 */
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "MedCare",
        address: "medCare.helpdesk@gmail.com"
      },
      ...mailOptions
    });
    
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

/**
 * Format date for email display
 * @param {Date|string} date - Date to format
 * @returns {Object} - Formatted date and time
 */
const formatDate = (date) => {
  const dateObj = new Date(date);
  return {
    date: dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

/**
 * Send appointment notification email
 * @param {Object} options - Appointment options
 * @returns {Promise} - Result of email sending
 */
export const appointmentEmail = async ({ email, date, doctorName, patientName, address }) => {
  try {
    const { date: formattedDate, time: formattedTime } = formatDate(date);
    
    const content = `
      <h1 class="heading">Appointment Confirmed</h1>
      <p class="paragraph">
        Dear <span class="highlight">${patientName}</span>, your appointment is confirmed. Below are the details:
      </p>
      <div class="details-container">
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Location:</strong> ${address}</p>
      </div>
      <p class="paragraph">
        If you have any questions, please reach out to us at <span class="highlight">medid.helpdesk@gmail.com</span>.
      </p>
    `;
    
    await sendEmail({
      to: email,
      subject: "Appointment Request Received",
      html: baseEmailTemplate({
        title: "Appointment Confirmation",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Appointment email error:", error);
    return false;
  }
};

/**
 * Send appointment confirmation email
 * @param {Object} options - Confirmation options
 * @returns {Promise} - Result of email sending
 */
export const confirmEmail = async ({ email, date, doctorName, patientName, address, customMessage }) => {
  try {
    const { date: formattedDate, time: formattedTime } = formatDate(date);
    
    const content = `
      <h1 class="heading">Appointment Confirmed</h1>
      <p class="paragraph">Dear <span class="highlight">${patientName}</span>,</p>
      <p class="paragraph">${customMessage || "We are delighted to confirm your appointment with MedCare. Here are the appointment details:"}</p>
      <div class="otp-container">
        <p class="otp-text">Date: ${formattedDate}</p>
        <p class="otp-text">Time: ${formattedTime}</p>
      </div>
      <p class="paragraph"><strong>Doctor:</strong> ${doctorName}</p>
      <p class="paragraph"><strong>Location:</strong> ${address}</p>
      <p class="paragraph">Please arrive 10 minutes early and contact support for changes.</p>
      <p class="paragraph highlight">For inquiries: medid.helpdesk@gmail.com</p>
    `;
    
    await sendEmail({
      to: email,
      subject: "Appointment Request Confirmed",
      html: baseEmailTemplate({
        title: "Appointment Confirmation",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Confirmation email error:", error);
    return false;
  }
};

/**
 * Send medical record creation email
 * @param {Object} options - Record options
 * @returns {Promise} - Result of email sending
 */
export const recordEmail = async ({ patientName, email }) => {
  try {
    const content = `
      <h2 class="heading">Medical Record Created</h2>
      <p class="paragraph">Dear ${patientName},</p>
      <p class="paragraph">We are pleased to inform you that your medical record has been successfully created on MedCare Locker.</p>
      <p class="paragraph">If you have any questions or need further assistance, please feel free to contact our support team at <span class="highlight">medid.helpdesk@gmail.com</span></p>
      <p class="paragraph">We appreciate your trust in MedCare and look forward to continuing to serve your healthcare needs.</p>
    `;
    
    await sendEmail({
      to: email,
      subject: "Medical Records Created",
      html: baseEmailTemplate({
        title: "Medical Records Created",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Record email error:", error);
    return false;
  }
};

/**
 * Send account creation email
 * @param {Object} options - Account options
 * @returns {Promise} - Result of email sending
 */
export const createAccountEmail = async ({ patientID, patientName, email }) => {
  try {
    const content = `
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
    `;
    
    await sendEmail({
      to: email,
      subject: "MedCare Account Created",
      html: baseEmailTemplate({
        title: "Account Created",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Account creation email error:", error);
    return false;
  }
};

/**
 * Send doctor account creation email
 * @param {Object} options - Account options
 * @returns {Promise} - Result of email sending
 */
export const createAccountDoctorEmail = async ({ doctorID, doctorName, email }) => {
  try {
    const content = `
      <h2 class="heading">Account Created Successfully</h2>
      <p class="paragraph">Dear ${doctorName},</p>
      <p class="paragraph">We are pleased to inform you that your account has been successfully created. Below are the details:</p>
      <div class="otp-container">
        <p class="otp-text"><strong>DocID:</strong> ${doctorID}</p>
      </div>
      <p class="paragraph">You can now log in to your account using your DocID.</p>
      <p class="paragraph">We appreciate your trust in MedCare and look forward to continuing to serve your healthcare needs.</p>
      <div class="footnote-container">
        <p class="footnote">
          If you didn't request this account, please contact our support team immediately.
        </p>
      </div>
    `;
    
    await sendEmail({
      to: email,
      subject: "MedCare Account Created",
      html: baseEmailTemplate({
        title: "Doctor Account Created",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Doctor account creation email error:", error);
    return false;
  }
};

/**
 * Send ID recovery email
 * @param {Object} options - Recovery options
 * @returns {Promise} - Result of email sending
 */
export const forgotemail = async ({ id, name, email }) => {
  try {
    const content = `
      <h2 class="heading">MedID Recovered Successfully</h2>
      <p class="paragraph">Dear ${name},</p>
      <p class="paragraph">We are pleased to inform you that your account has been successfully recovered.</p>
      <div class="otp-container">
        <p class="otp-text"><strong>Account ID:</strong> ${id}</p>
      </div>
      <p class="paragraph">You can now log in to your account using this ID.</p>
      <p class="paragraph">Thank you for choosing MedCare. We look forward to serving you.</p>
    `;
    
    await sendEmail({
      to: email,
      subject: "MedID Recovered",
      html: baseEmailTemplate({
        title: "ID Recovery",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("ID recovery email error:", error);
    return false;
  }
};

/**
 * Send appointment cancellation email
 * @param {Object} options - Cancellation options
 * @returns {Promise} - Result of email sending
 */
export const cancelAppointment = async ({ email, patientName, reason }) => {
  try {
    const content = `
      <h1 class="heading">Appointment Cancelled</h1>
      <p class="paragraph">
        Dear <span class="highlight">${patientName}</span>, we regret to inform you that your appointment has been cancelled.
      </p>
      ${reason ? `<p class="paragraph">Reason: ${reason}</p>` : ''}
      <p class="paragraph">
        We apologize for any inconvenience caused. If you would like to reschedule your appointment, please contact us at <span class="highlight">medid.helpdesk@gmail.com</span>.
      </p>
    `;
    
    await sendEmail({
      to: email,
      subject: "Appointment Request Cancelled",
      html: baseEmailTemplate({
        title: "Appointment Cancellation",
        content
      })
    });
    
    return true;
  } catch (error) {
    console.error("Cancellation email error:", error);
    return false;
  }
};

/**
 * Generate a hash for prescription verification
 * @param {Object} data - Data to hash
 * @returns {String} - Hash string
 */
const generateHash = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
};

/**
 * Generate PDF prescription using PDFKit
 * @param {Object} data - Prescription data
 * @returns {Stream} - PDF buffer stream
 */
export const generatePDFKitPrescriptionBuffer = (data) => {
  const { patientName, email, diagnosis, prescription, notes, date } = data;
  const hash = generateHash({ patientName, diagnosis, prescription });

  const doc = new PDFDocument({ margin: 40 });
  const bufferStream = new PassThrough();

  // Pipe the PDF into a buffer stream
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
  let tableTop = doc.y;
  doc
    .fontSize(10)
    .fillColor("#0a58ca")
    .text("#", 50, tableTop)
    .text("Medication", 100, tableTop)
    .text("Dose", 250, tableTop)
    .text("Frequency", 330, tableTop)
    .text("Duration", 420, tableTop);

  doc.moveDown(0.5);

  // Table Rows
  prescription.forEach((med, index) => {
    let rowY = doc.y;
    doc
      .fontSize(10)
      .fillColor("#333")
      .text(`${index + 1}`, 50, rowY)
      .text(med.name, 100, rowY)
      .text(med.dose, 250, rowY)
      .text(med.frequency, 330, rowY)
      .text(med.duration, 420, rowY);

    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // Remarks Section
  if (notes) {
    doc.moveDown(1);
    doc.fillColor("#555").text(`Remarks: ${notes}`, { align: "center" });
    doc.moveDown(1);
  }

  // Footer with digital signature
  const pageWidth = doc.page.width;
  
  doc.fontSize(10).fillColor("#666");
  
  const text1 = "This is a digitally generated prescription.";
  const text1Width = doc.widthOfString(text1);
  doc.text(text1, (pageWidth - text1Width) / 2);
  
  const text2 = `Digital Signature: ${hash}`;
  const text2Width = doc.widthOfString(text2);
  doc.text(text2, (pageWidth - text2Width) / 2);

  // Finalize PDF
  doc.end();

  return bufferStream;
};

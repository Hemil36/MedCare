import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Writable } from "stream";

import CryptoJS from "crypto-js";
import transporter from "../services/email.js";
function generatePDF({
  patientName,
  doctorName,
  patientEmail,
  prescriptionDate,
  diagnosis,
  medicationPrescription,
  remarks,
  hash,
}) {
  return new Promise((resolve, reject) => {
    var doc = new PDFDocument({ margin: 50, color: "#131619" });
    const buffers = [];

    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        buffers.push(chunk);
        callback();
      },
    });

    doc.pipe(writableStream);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#131619");

    doc
      .font("Helvetica-Bold")
      .fontSize(25)
      .fillColor("#33fab2")
      .text("MedCare")
      .moveDown(1);

    // Patient Details
    doc.font("Helvetica");
    doc
      .fontSize(14)
      .fillColor("white")
      .text("Patient: " + patientName)
      .moveDown(0.1)
      .text("Doctor: " + doctorName)
      .moveDown(0.1)
      .text("Email: " + patientEmail)
      .moveDown(0.1)
      .text("Prescription Date: " + prescriptionDate)
      .moveDown();

    // Diagnosis
    doc
      .fontSize(14)
      .text("Diagnosis: " + diagnosis, { underline: true })
      .moveDown()
      .fillColor("white");

    // Prescription Table Header
    const startX = 50;
    const startY = doc.y;
    const tableWidth = 500;
    const rowHeight = 30;

    doc
      .rect(startX, startY, tableWidth, rowHeight)
      .fillAndStroke("#131619", "#48d77c");
    doc
      .fontSize(12)
      .fillColor("white")
      .text("Medication", startX + 10, startY + 10)
      .text("Dose", startX + 150, startY + 10)
      .text("Frequency", startX + 250, startY + 10)
      .text("Duration", startX + 400, startY + 10)
      .fillColor("white");

    // Add Prescription Details (content)
    medicationPrescription.forEach((prescription, index) => {
      const contentStartY = startY + rowHeight + index * rowHeight;
      doc.rect(startX, contentStartY, tableWidth, rowHeight).stroke();
      doc
        .text(prescription.name, startX + 10, contentStartY + 10)
        .fillColor("white")
        .text(prescription.dose, startX + 150, contentStartY + 10)
        .text(prescription.frequency, startX + 250, contentStartY + 10)
        .text(prescription.duration, startX + 400, contentStartY + 10)
        .fillColor("white");
    });

    // Remarks Section
    doc
      .moveDown(2)
      .fontSize(14)
      .text("Remarks:", 50, doc.y, { underline: true })
      .fontSize(12)
      .text(remarks)
      .moveDown()
      .fillColor("white");

    // Footer
    doc
      .moveDown(2)
      .fontSize(10)
      .text("This is a digitally generated prescription.", {
        align: "center",
        oblique: true,
      })
      .moveDown()
      .text("Digital Signature: " + hash, { align: "center" });

    // Finalize the PDF and return the blob
    doc.end();
    writableStream.on("finish", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    writableStream.on("error", reject);
  });
}

export async function sendEmail({
  patientName,
  doctorName,
  patientEmail,
  prescriptionDate,
  diagnosis,
  medicationPrescription,
  remarks,
}) {

  const hash = generateHash({
    patientEmail,
    prescriptionDate,
    diagnosis,
    medicationPrescription,
    remarks,
  });
  generatePDF({
    patientName,
    doctorName,
    patientEmail,
    prescriptionDate,
    diagnosis,
    medicationPrescription,
    remarks,
    hash,
  })
    .then((pdfBuffer) => {
     


      const mailOptions = {
        from: {
          name: "MedCare",
          address: "medCare.helpdesk@gmail.com",
        }, // sender address
        to: patientEmail, // recipient address
        subject: "Your Prescription",
        text: "Please find attached your prescription.",
        attachments: [
          {
            filename: "Prescription.pdf",
            content: pdfBuffer,
            encoding: "base64",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred while sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
}

const generateHash = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
};

import nodemailer from 'nodemailer';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "medid.helpdesk@gmail.com", // your email
    pass: "yrrr vsfj dxiv gkdr", // your email password
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: {
        name: 'MedID',
        address: 'medid.helpdesk@gmail.com'
      }, // sender address
      to: to, // recipient address
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;

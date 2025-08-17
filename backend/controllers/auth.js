import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import Doctor from "../models/Doctor.js";
import transporter from "../services/email.js";
import {
  createAccountDoctorEmail,
  createAccountEmail,
  forgotemail,
} from "./email.js";
import OneTimePassword from "../models/OneTimePassword.js";

// Constants and configurations
const JWT_EXPIRY = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "7d",
  OTP_TOKEN: "10m",
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};



/**
 * Helper function for standardized responses
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Generate a unique ID with specified format
 */
const generateCustomId = (prefix = "") => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 12);
  const randomString = nanoid();

  // Format: XXXX-XXXX-XXXX or PREFIX-XXXX-XXXX
  if (prefix) {
    return `${prefix}${randomString.slice(0, 4)}`;
  }
  return `${randomString.slice(0, 4)}-${randomString.slice(4, 8)}-${randomString.slice(8, 12)}`;
};

/**
 * Generate a secure OTP
 */
const generateOTP = () => {
  const alphabet = "0123456789";
  const nanoid = customAlphabet(alphabet, 6);
  return nanoid();
};

/**
 * Generate JWT tokens
 */
const generateTokens = (payload) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secret keys are not configured");
  }

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: JWT_EXPIRY.ACCESS_TOKEN }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: JWT_EXPIRY.REFRESH_TOKEN }
  );

  return { accessToken, refreshToken };
};

/**
 * Initialize local variables for OTP
 */
export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    OTPExpiry: null,
  };
  next();
}

/**
 * Handle forgotten ID recovery
 */
export const forgotID = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }

    // Find user by email (check both models)
    const [user, doctor] = await Promise.all([
      User.findOne({ email }),
      Doctor.findOne({ email }),
    ]);

    if (!user && !doctor) {
      return sendResponse(res, 404, false, "No account found with this email");
    }

    // Send recovery email based on account type
    if (user) {
      await forgotemail({ id: user.patientID, name: user.name, email });
    } else {
      await forgotemail({ id: doctor.doctorID, name: doctor.name, email });
    }

    return sendResponse(res, 200, true, "Recovery email sent successfully");
  } catch (error) {
    console.error("Forgot ID Error:", error);
    return sendResponse(res, 500, false, "Failed to process recovery request");
  }
};

/**
 * Send OTP for verification
 */
export const OTPSender = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }


    const duplicate = await OneTimePassword.find({ email: email });

    if (duplicate.length > 3) {
      // Handle case where user has requested too many OTPs
      return sendResponse(res, 429, false, "Too many OTP requests");
    }

    const otp = generateOTP();

    // Store OTP in database
    await OneTimePassword.create({ email : email, otp, createdAt: Date.now() });

    // Create email content
    const mailOptions = {
      from: {
        name: "MedCare",
        address: process.env.EMAIL_USER || "medCare.helpdesk@gmail.com",
      },
      to: email,
      subject: "Your MedCare Verification Code",
      html: generateOtpEmailTemplate(otp),
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return sendResponse(res, 200, true, "OTP sent successfully");
  } catch (error) {
    console.error("OTP Sender Error:", error);
    return sendResponse(res, 500, false, "Failed to send OTP");
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  const { otp , email } = req.body;


  try {
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }
    if (!otp) {
      return sendResponse(res, 400, false, "OTP is required");
    }

    // Check if OTP exists and is valid
    const otpRecord = await OneTimePassword.findOne({
      email : email,
      otp,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return sendResponse(res, 400, false, "Invalid or expired OTP");
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.createdAt + 10 * 60 * 1000) { // 10 minutes
      await OneTimePassword.deleteOne({ _id: otpRecord._id });
      return sendResponse(res, 400, false, "OTP has expired");
    }

    // Compare OTP
    if (parseInt(otpRecord.otp) === parseInt(otp)) {
      // Reset OTP after successful verification
      await OneTimePassword.deleteOne({ _id: otpRecord._id });
      return sendResponse(res, 200, true, "OTP verified successfully");
    }

    return sendResponse(res, 400, false, "Invalid OTP");
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return sendResponse(res, 500, false, "Failed to verify OTP");
  }
};

/**
 * User login
 */
export const login = async (req, res) => {
  try {
    const { patientID, email } = req.body;

    if (!patientID || !email) {
      return sendResponse(res, 400, false, "Patient ID and email are required");
    }

    // Find patient by ID and email
    const patient = await User.findOne({ patientID, email });
    if (!patient) {
      return sendResponse(res, 404, false, "Invalid credentials");
    }

    // Generate tokens
    const payload = {
      id: patient._id,
      patientID: patient.patientID,
      name: patient.name,
      role: "patient",
    };

    try {
      const { accessToken, refreshToken } = generateTokens(payload);

      // Set refresh token in HTTP-only cookie
      res.cookie("jwt", refreshToken, COOKIE_OPTIONS);

      return sendResponse(res, 200, true, "Login successful", {
        accessToken,
        patientID: patient.patientID,
        name: patient.name,
        role: "patient",
      });
    } catch (tokenError) {
      console.error("Token Generation Error:", tokenError);
      return sendResponse(res, 500, false, "Authentication error");
    }
  } catch (error) {
    console.error("Login Error:", error);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

/**
 * Doctor login
 */
export const loginDoctor = async (req, res) => {
  try {
    const { doctorID, email } = req.body;

    if (!doctorID || !email) {
      return sendResponse(res, 400, false, "Doctor ID and email are required");
    }

    // Find doctor by ID and email
    const doctor = await Doctor.findOne({ doctorID, email });
    if (!doctor) {
      return sendResponse(res, 404, false, "Invalid credentials");
    }

    // Generate tokens
    const payload = {
      id: doctor._id,
      doctorID: doctor.doctorID,
      name: doctor.name,
      role: "doctor",
    };

    try {
      const { accessToken, refreshToken } = generateTokens(payload);

      // Set refresh token in HTTP-only cookie
      res.cookie("jwt", refreshToken, COOKIE_OPTIONS);

      return sendResponse(res, 200, true, "Login successful", {
        accessToken,
        doctorID: doctor.doctorID,
        name: doctor.name,
        role: "doctor",
      });
    } catch (tokenError) {
      console.error("Token Generation Error:", tokenError);
      return sendResponse(res, 500, false, "Authentication error");
    }
  } catch (error) {
    console.error("Doctor Login Error:", error);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

/**
 * User registration
 */
export const register = async (req, res) => {
  try {
    const { type } = req.body;

    // Delegate to doctor registration if needed
    if (type === "doctor") {
      return registerDoctor(req, res);
    }

    const {
      name,
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
      identificationDocument,
    } = req.body.data;

    // Validate required fields
    if (!name || !email || !phone) {
      return sendResponse(res, 400, false, "Name, email, and phone are required");
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { adhaarNumber }],
    });

    if (existingUser) {
      return sendResponse(res, 409, false, "User already exists");
    }

    // Generate patient ID and create new user
    const patientID = generateCustomId();
    const newUser = new User({
      name,
      email,
      phone,
      gender,
      patientID,
      adhaarNumber,
      currentMedication,
      pastMedicalHistory,
      identificationDocument,
      emergencyContactName,
      emergencyPhone,
    });

    await newUser.save();

    // Send welcome email asynchronously
    createAccountEmail({ patientID, patientName: name, email }).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    return sendResponse(res, 201, true, "Registration successful", { patientID });
  } catch (error) {
    console.error("Registration Error:", error);
    return sendResponse(res, 500, false, "Registration failed");
  }
};

/**
 * Doctor registration
 */
export const registerDoctor = async (req, res) => {
  try {
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
      identificationDocument,
      clinicaddress,
      photo,
    } = req.body.data;

    // Validate required fields
    if (!name || !email || !phone || !councilID || !speciality) {
      return sendResponse(res, 400, false, "Missing required fields");
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ councilID });
    if (existingDoctor) {
      return sendResponse(res, 409, false, "Doctor already exists with this council ID");
    }

    // Generate doctor ID and create new doctor
    const doctorID = generateCustomId("DOC");
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
      qualification: degree,
      colleage,
      identificationType,
      adhaarNumber,
      identificationDocument,
      doctorID,
      clinicAddress: clinicaddress,
      photo,
    });

    await newDoctor.save();

    // Send welcome email asynchronously
    createAccountDoctorEmail({ doctorID, doctorName: name, email }).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    return sendResponse(res, 201, true, "Doctor registered successfully", { doctorID });
  } catch (error) {
    console.error("Doctor Registration Error:", error);
    return sendResponse(res, 500, false, "Registration failed");
  }
};

/**
 * Verify user exists
 */
export const verifyUser = async (req, res) => {
  const { patientID, email } = req.body;

  try {
    if (!patientID || !email) {
      return sendResponse(res, 400, false, "Patient ID and email are required");
    }

    const user = await User.findOne({ patientID, email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User verified successfully");
  } catch (error) {
    console.error("Verify User Error:", error);
    return sendResponse(res, 500, false, "Verification failed");
  }
};

/**
 * Handle refresh token to generate new access token
 */
export const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return sendResponse(res, 401, false, "Refresh token not found");
    }

    const refreshToken = cookies.jwt;

    if (!process.env.REFRESH_TOKEN_SECRET) {
      return sendResponse(res, 500, false, "Server configuration error");
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return sendResponse(res, 403, false, "Invalid refresh token");
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          ...(decoded.patientID && { patientID: decoded.patientID }),
          ...(decoded.doctorID && { doctorID: decoded.doctorID }),
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: JWT_EXPIRY.ACCESS_TOKEN }
      );

      return sendResponse(res, 200, true, "Token refreshed", { accessToken });
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return sendResponse(res, 500, false, "Failed to refresh token");
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    // Clear JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return sendResponse(res, 200, true, "Logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
    return sendResponse(res, 500, false, "Logout failed");
  }
};

/**
 * Generate OTP email template
 */
function generateOtpEmailTemplate(otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
      /* Email styling */
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        background-color: #000000 !important;
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
                <p class="logo">MedCare</p>
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
              <p class="footer-text">© 2025 MedCare. All rights reserved.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

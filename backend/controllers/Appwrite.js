import { InputFile } from "node-appwrite";
import { storage1 } from "../lib/appwrite.js";
import { recordEmail } from "./email.js";
import QRCode from "qrcode";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Helper function for standardized responses
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Helper function to create secure links with JWT
 */
const generateSecureLink = async (fileId, endpoint, expiresIn = "5min") => {
  // Generate JWT token with expiration
  const token = jwt.sign({ fileId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
  
  // Create a secure link
  const secureLink = `${process.env.BASE_URL}/api/${endpoint}/${fileId}?token=${token}`;
  
  // Generate QR Code for the link
  const qrCode = await QRCode.toDataURL(secureLink)
    .catch(() => null);
  
  return { secureLink, qrCode };
};

/**
 * Helper function to verify token and get file ID
 */
const verifyFileToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid or expired token"));
      } else {
        resolve(decoded.fileId);
      }
    });
  });
};

/**
 * Get all medical records for a patient
 */
export const getRecords = async (req, res) => {
  const { patientID } = req.query;
  
  try {
    if (!patientID) {
      return sendResponse(res, 400, false, "Patient ID is required");
    }
    
    // Fetch all files and filter by patient ID
    const files = await storage1.listFiles('Image', []);
    const filteredFiles = files.files.filter(file => 
      file.name.startsWith(`${patientID}_`)
    );

    // Create view and download links for each file in parallel
    const filesWithLinks = await Promise.all(filteredFiles.map(async (file) => {
      // Generate both links in parallel for better performance
      const [viewLink, downloadLink] = await Promise.all([
        generateSecureLink(file.$id, 'view-file'),
        generateSecureLink(file.$id, 'download-file', "1h")
      ]);
      
      return {
        id: file.$id,
        name: file.name,
        size: file.sizeOriginal,
        createdAt: file.$createdAt,
        type: file.mimeType,
        url: viewLink.secureLink,
        downloadUrl: downloadLink.secureLink,
        qrCode: viewLink.qrCode
      };
    }));

    return sendResponse(res, 200, true, "Records retrieved successfully", { files: filesWithLinks });
  } catch (error) {
    console.error("Get Records Error:", error);
    return sendResponse(res, 500, false, "Failed to retrieve records", { error: error.message });
  }
};

/**
 * Upload a new medical record file
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, "No file was uploaded");
    }
    
    const fileBuffer = req.file.buffer;
    const { patientID, name, email, patientName, type } = req.body;
    
    // Validate required fields
    if (!patientID || !name || !type) {
      return sendResponse(res, 400, false, "Patient ID, file name, and file type are required");
    }

    const fileName = `${patientID}_${name}.${type}`;
    
    // Check for duplicate file names
    const files = await storage1.listFiles('Image', []);
    const fileExists = files.files.some(file => file.name === fileName);
    
    if (fileExists) {
      return sendResponse(res, 409, false, "A file with this name already exists");
    }
    
    // Upload the file
    const fileInput = InputFile.fromBuffer(fileBuffer, fileName);
    const uploadedFile = await storage1.createFile('Image', fileName, fileInput);
    
    // Send notification email asynchronously
    if (email) {
      recordEmail({ patientName, email })
        .catch(err => console.error("Failed to send record email:", err));
    }
    
    // Generate secure link for the uploaded file
    const viewLink = await generateSecureLink(uploadedFile.$id, 'view-file');
    
    return sendResponse(res, 201, true, "File uploaded successfully", {
      fileId: uploadedFile.$id,
      fileName: uploadedFile.name,
      viewUrl: viewLink.secureLink
    });
  } catch (error) {
    console.error("Upload File Error:", error);
    return sendResponse(res, 500, false, "Error uploading file", { error: error.message });
  }
};

/**
 * Delete a medical record file
 */
export const deleteFile = async (req, res) => {
  const { id: fileId  } = req.query;
  
  try {
    if (!fileId) {
      return sendResponse(res, 400, false, "File ID is required");
    }
    
    // Check if file exists before attempting to delete
    try {
      await storage1.getFile('Image', fileId);
    } catch (error) {
      return sendResponse(res, 404, false, "File not found");
    }
    
    await storage1.deleteFile('Image', fileId);
    return sendResponse(res, 200, true, "File deleted successfully");
  } catch (error) {
    console.error("Delete File Error:", error);
    return sendResponse(res, 500, false, "Error deleting file", { error: error.message });
  }
};

/**
 * Download a file with token verification
 */
export const downloadLink = async (req, res) => {
  const { id: fileId  } = req.params;
  const { token } = req.query;
  
  if (!token) {
    return sendResponse(res, 401, false, "Authentication token is required");
  }
  
  try {
    // Verify token and get file ID
    await verifyFileToken(token);
    
    // Fetch file content
    const fileContent = await storage1.getFileView("Image", fileId);
    const fileDetails = await storage1.getFile("Image", fileId);
    
    const fileBuffer = Buffer.from(new Uint8Array(fileContent));
    
    // Set appropriate headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${fileDetails.name}"`);
    res.setHeader("Content-Type", fileDetails.mimeType || 'application/octet-stream');
    res.setHeader("Content-Length", fileBuffer.length);
    
    return res.send(fileBuffer);
  } catch (error) {
    console.error("Download File Error:", error);
    
    if (error.message === "Invalid or expired token") {
      return sendResponse(res, 403, false, "Access denied: Token expired or invalid");
    }
    
    return sendResponse(res, 500, false, "Error downloading file", { error: error.message });
  }
};

/**
 * Generate a secure download link for a file
 */
export const createDownloadLink = async (req, res) => {
  const { id: fileId  } = req.params || req.query;
  
  try {
    if (!fileId) {
      return sendResponse(res, 400, false, "File ID is required");
    }
    
    // Check if file exists
    try {
      await storage1.getFile('Image', fileId);
    } catch (error) {
      return sendResponse(res, 404, false, "File not found");
    }
    
    const { secureLink, qrCode } = await generateSecureLink(fileId, 'download-file', "1h");
    
    return res.status(200).json({
      success: true,
      message: "Download link created",
      secureLink,
      qrCode
    });
  } catch (error) {
    console.error("Create Download Link Error:", error);
    return sendResponse(res, 500, false, "Error creating download link", { error: error.message });
  }
};

/**
 * View a file with token verification
 */
export const viewFile = async (req, res) => {
  const { id: fileId } = req.params;
  const { token } = req.query;
  
  if (!token) {
    return sendResponse(res, 401, false, "Authentication token is required");
  }
  
  try {
    // Verify token and get file ID
    await verifyFileToken(token);
    
    // Get file content and metadata
    const [fileContent, fileDetails] = await Promise.all([
      storage1.getFileView("Image", fileId),
      storage1.getFile("Image", fileId)
    ]);
    
    const imageBuffer = Buffer.from(new Uint8Array(fileContent));
    
    // Set appropriate content type based on file type
    if (fileDetails.mimeType === 'application/pdf') {
      res.setHeader("Content-Type", "application/pdf");
    } else if (fileDetails.mimeType.startsWith('image/')) {
      res.setHeader("Content-Type", fileDetails.mimeType);
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }
    
    res.setHeader("Content-Length", imageBuffer.length);
    return res.send(imageBuffer);
  } catch (error) {
    console.error("View File Error:", error);
    
    if (error.message === "Invalid or expired token") {
      return sendResponse(res, 403, false, "Access denied: Token expired or invalid");
    }
    
    return sendResponse(res, 500, false, "Error viewing file", { error: error.message });
  }
};

/**
 * View a prescription file with token verification
 */
export const viewPres = async (req, res) => {
  const { id: fileId  } = req.params;
  const { token } = req.query;
  
  if (!token) {
    return sendResponse(res, 401, false, "Authentication token is required");
  }
  
  try {
    // Verify token and get file ID
    await verifyFileToken(token);
    
    // Get prescription file content
    const fileContent = await storage1.getFileView("Prescription", fileId);
    const imageBuffer = Buffer.from(new Uint8Array(fileContent));
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", imageBuffer.length);
    return res.send(imageBuffer);
  } catch (error) {
    console.error("View Prescription Error:", error);
    
    if (error.message === "Invalid or expired token") {
      return sendResponse(res, 403, false, "Access denied: Token expired or invalid");
    }
    
    return sendResponse(res, 404, false, "Prescription not found or access expired");
  }
};

/**
 * Create a link to view a file (internal helper function)
 */
export const createLink = async ({ fileId }) => {
  return generateSecureLink(fileId, 'view-file');
};

/**
 * Create a link to view a prescription (internal helper function)
 */
export const createLink2 = async ({ fileId }) => {
  return generateSecureLink(fileId, 'view-pres', "1d");
};
import Patient from "../models/User.js";

/**
 * Helper function for standardized responses
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Get patient details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPatient = async (req, res) => {
  try {
    const { patientID } = req.query;
    
    if (!patientID) {
      return sendResponse(res, 400, false, "Patient ID is required");
    }
    
    const patient = await Patient.findOne({ patientID })
      .select('email phone address occupation emergencyContactName emergencyPhone gender name');
    
    if (!patient) {
      return sendResponse(res, 404, false, "Patient not found");
    }
    
    return sendResponse(res, 200, true, "Patient retrieved successfully", patient);
  } catch (error) {
    console.error("Get Patient Error:", error);
    return sendResponse(res, 500, false, "Failed to retrieve patient details", { error: error.message });
  }
};

/**
 * Update patient details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePatient = async (req, res) => {
  try {
    const { patientID, data } = req.body;
    
    // Validate required fields
    if (!patientID) {
      return sendResponse(res, 400, false, "Patient ID is required");
    }
    
    if (!data || Object.keys(data).length === 0) {
      return sendResponse(res, 400, false, "No update data provided");
    }
    
    // Find patient
    const patient = await Patient.findOne({ patientID });
    if (!patient) {
      return sendResponse(res, 404, false, "Patient not found");
    }
    
    // Define allowed fields to update
    const allowedFields = [
      'email', 'phone', 'address', 'occupation', 
      'emergencyContactName', 'emergencyPhone'
    ];
    
    // Update allowed fields only
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        patient[field] = data[field];
      }
    });
    
    await patient.save();
    
    // Remove sensitive information from response
    const removeKeys = ["adhaarNumber", "identificationDocument", "identificationType", "password"];
    const filteredPatient = Object.fromEntries(
      Object.entries(patient._doc).filter(([key]) => !removeKeys.includes(key))
    );
    
    return sendResponse(res, 200, true, "Patient details updated successfully", filteredPatient);
  } catch (error) {
    console.error("Update Patient Error:", error);
    return sendResponse(res, 500, false, "Failed to update patient details", { error: error.message });
  }
};

/**
 * Check if patient with email exists
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const patientExist = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }
    
    const patient = await Patient.exists({ email });
    
    if (patient) {
      return sendResponse(res, 409, false, "Patient with this email already exists");
    }
    
    return sendResponse(res, 200, true, "Email is available for registration");
  } catch (error) {
    console.error("Check Patient Existence Error:", error);
    return sendResponse(res, 500, false, "Failed to check patient existence", { error: error.message });
  }
};

/**
 * Get all patients (for admin use)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Build filter query
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { patientID: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get patients with pagination
    const [total, patients] = await Promise.all([
      Patient.countDocuments(filter),
      Patient.find(filter)
        .select('name email phone gender patientID createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ]);
    
    return sendResponse(res, 200, true, "Patients retrieved successfully", {
      patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get All Patients Error:", error);
    return sendResponse(res, 500, false, "Failed to retrieve patients", { error: error.message });
  }
};

/**
 * Delete a patient (for admin use)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePatient = async (req, res) => {
  try {
    const { patientID } = req.params;
    
    if (!patientID) {
      return sendResponse(res, 400, false, "Patient ID is required");
    }
    
    const patient = await Patient.findOne({ patientID });
    
    if (!patient) {
      return sendResponse(res, 404, false, "Patient not found");
    }
    
    await Patient.deleteOne({ patientID });
    
    return sendResponse(res, 200, true, "Patient deleted successfully");
  } catch (error) {
    console.error("Delete Patient Error:", error);
    return sendResponse(res, 500, false, "Failed to delete patient", { error: error.message });
  }
};
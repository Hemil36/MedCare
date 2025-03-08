import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed: Missing or malformed token." 
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ 
            success: false, 
            message: "Session expired. Please log in again." 
          });
        } else {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid token. Please log in again." 
          });
        }
      }


      req.user = {
        id: decoded.patientID || decoded.doctorID,
        role: decoded.patientID ? "patient" : "doctor",
        name: decoded.name,
      };


      next();
    });

  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error. Please try again later." 
    });
  }
};

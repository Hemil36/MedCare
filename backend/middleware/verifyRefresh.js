import jwt from "jsonwebtoken";

export const verifyRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No refresh token found. Please log in again." 
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({ 
            success: false, 
            message: "Session expired. Please log in again." 
          });
        }
        return res.status(403).json({ 
          success: false, 
          message: "Invalid refresh token. Please log in again." 
        });
      }

      const newAccessToken = jwt.sign(
        { patientID: decoded.patientID, name: decoded.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" } 
      );

      res.json({ 
        success: true, 
        message: "Access token refreshed successfully.", 
        accessToken: newAccessToken 
      });
    });

  } catch (error) {
    console.error("Refresh Token Verification Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error. Please try again later." 
    });
  }
};

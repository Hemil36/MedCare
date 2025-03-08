import { InputFile } from "node-appwrite";
import { storage1 } from "../lib/appwrite.js";
import { recordEmail } from "./email.js";
import QRCode from "qrcode";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const getRecords = async (req, res) => {
  const { patientID } = req.query;
  try {
    if (!patientID) {
      throw "Patient ID is required";
    }
    const files = await storage1.listFiles('Image', []);
    const filteredFiles = files.files.filter(file =>
      file.name.startsWith(`${patientID}_`)
    );


    const maps = await Promise.all(filteredFiles.map(async (file) => {
      const res = await createLink({fileId:file.$id});
      const downloadLink = await createDownloadLink({fileId:file.$id});
      // const downloadHref = `https://cloud.appwrite.io/v1/storage/buckets/Image/files/${file.$id}/download?project=66a12c91000a4cded686`;

      return {
        ...file,
        url: res.secureLink,
        downloadLink: downloadLink.secureLink,
      };
    }));
    

    return res.status(200).json({ filteredFiles : maps });
  }
  catch (err) {
    return res.status(400).json({ err })
  }
}

export const uploadFile =  async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    var { patientID, name, email ,patientName,type} = req.body;
    
    console.log(patientID,name,email,fileBuffer)

    const name1 = `${patientID}_${name}.${type}`;


    const files = await storage1.listFiles('Image', []);
    const filteredFiles = files.files.filter(file =>
      file.name == name1
    );

    if(filteredFiles.length>0)
      return res.status(400).json({message : "File Name already exist"})


    const t = InputFile.fromBuffer(fileBuffer, name1);
    console.log(name1)

    const response = await storage1.createFile('Image', name1, t);


    await recordEmail({ patientName, email })
    res.status(200).json({
      message: 'File uploaded successfully',
      fileId: response.$id,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
};


export const deleteFile =  async (req, res) => {
    const { fileId } = req.query;
  
    try {
      await storage1.deleteFile('Image', fileId);
      res.status(200).json({
        message: 'File deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error deleting file',
        error: error.message,
      });
    }
  };



  export const downloadLink = async (req, res) => {
    const { fileId } = req.params;
    const token = req.query.token;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      try {
        
        const response = await storage1.getFileView("Image", fileId);
  
        const imageBuffer = Buffer.from(new Uint8Array(response));
  
        res.setHeader("Content-Disposition", `attachment; filename="${fileId}"`);
        res.setHeader("Content-Type",  'application/octet-stream');
  
        res.send(imageBuffer);
  
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  };
  
  



export const createLink =  async ({fileId}) => {

  // Generate JWT token with expiration
  const token = jwt.sign({ fileId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1min" });

  const secureLink = `${process.env.BASE_URL}/api/view-file/${fileId}?token=${token}`;

  // Generate QR Code
  const qrCode = await new Promise((resolve, reject) => {
    QRCode.toDataURL(secureLink, (err, url) => {
      if (err) {
        reject("Failed to generate QR Code");
      }
      resolve(url);
    });
  });

  return { secureLink, qrCode };

};
export const createDownloadLink = async ({ fileId }) => {
  // Generate JWT token with expiration
  const token = jwt.sign({ fileId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1min" });

  // ✅ Create a secure download link
  const secureLink = `${process.env.BASE_URL}/api/download-file/${fileId}?token=${token}`;

  // ✅ Generate QR Code for download link
  const qrCode = await new Promise((resolve, reject) => {
    QRCode.toDataURL(secureLink, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });

  return { secureLink, qrCode };
};

export const viewFile =  async (req, res) => {
  const { fileId } = req.params;

  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const response = await storage1.getFileView("Image",fileId);
      const file = await storage1.getFile("Image", fileId);
      console.log(file)
      const imageBuffer = Buffer.from(new Uint8Array(response));
      
       if(file.mimeType == 'application/pdf')
        res.setHeader("Content-Type", "application/pdf");
      else 
        res.setHeader("Content-Type", "image/png");
      res.send(imageBuffer);
    } catch (error) {
      res.status(404).json({ error: "File not found or access expired" });
    }
  });

};
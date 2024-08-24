import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import routes from "./routes/route.js";
import bodyParser from "body-parser";
import cors from "cors";
import doctor from "./models/Doctor.js";
import nodemailer from "nodemailer";
import { OTPSender } from "./controllers/auth.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import multer from "multer";
import { verifyJWT } from "./middleware/verifyJWT.js";
import {storage1 } from "./appwrite.js";
import { Readable } from "stream";
import fs from 'fs';
import sdk, { InputFile, Query} from 'node-appwrite';
import { appointmentEmail } from "./controllers/email.js";


dotenv.config();

const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage });

const app = express();
 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed


await mongoose.connect("mongodb+srv://hemildudhat04:hemil04@cluster0.ifcde31.mongodb.net/PatientManagement?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
    });




    const corsOptions = {
      origin: (origin, callback) => {
          if (origin === 'http://localhost:5173' || !origin) {
              callback(null, true);
          } else {
              callback(new Error('Not allowed by CORS'));
          }
          optionsSuccessStatus: 200
  
      }
  }

    const credentials = (req, res, next) => {
    
      res.header('Access-Control-Allow-Credentials', true);
  
  next();
  }
  
  app.use(credentials);
  app.use(cors(corsOptions))
  app.use(cookieParser());
  

  app.post("/api/getRecords", verifyJWT, async (req, res) => {
    const { patientID } = req.body;
    // console.log(patientID);
try{
    const files = await storage1.listFiles('Image',[]);
    const filteredFiles = files.files.filter(file =>
      file.name.startsWith(`${patientID}_`) 
   );


   const maps = filteredFiles.map( async (file) => {
    // console.log(file.$id)

    const response = await storage1.getFilePreview("Image",file.$id);
    // console.log(response)
    
    })

    await Promise.all(maps)



  

    return res.status(200).json({filteredFiles});
  }
  catch(err){
    return res.status(400).json({err})
  }
  })


  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        var { patientID , name } = req.body;

        const name1 = `${patientID}_${name}.pdf`;
       
        
     const t = InputFile.fromBuffer(fileBuffer, name1);

     const response = await storage1.createFile('Image',name1, t);

    
    //  console.log(response)

        res.status(200).json({
            message: 'File uploaded successfully',
            fileId: response.$id,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error uploading file',
            error: error.message,
        });
    }
});

app.post('/api/delete', async (req, res) => {
  const { fileId } = req.body;
  console.log(fileId)

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


});
    
  
   
   
app.use("/api",routes)


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
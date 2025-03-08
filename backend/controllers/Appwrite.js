import { InputFile } from "node-appwrite";
import { storage1 } from "../lib/appwrite.js";
import { recordEmail } from "./email.js";

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


    const maps = filteredFiles.map(async (file) => {

      const response = await storage1.getFilePreview("Image", file.$id);

    })

    await Promise.all(maps)

    return res.status(200).json({ filteredFiles });
  }
  catch (err) {
    return res.status(400).json({ err })
  }
}

export const uploadFile =  async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    var { patientID, name, email ,patientName} = req.body;
    console.log(patientID,name,email,fileBuffer)

    const name1 = `${patientID}_${name}.pdf`;


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
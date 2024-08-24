import React from 'react'
import { Client, Storage } from "appwrite";

const Test = () => {


const client = new Client().setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('66a12c91000a4cded686') // Your project ID
   // Your API Key

  const storage = new Storage(client);


  async function uploadDocument( file) {
    try {
      const response = await storage.createFile("Image", "223-456-789_Reports", file);
      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

    uploadDocument('Image', './index.js');
  return (
    <div>Test
        <input type="file" onChange={(e)=>{
            console.log(e.target.files[0])
            uploadDocument(e.target.files[0])}} />
    </div>
  )
}

export default Test
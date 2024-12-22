import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  import dotenv from "dotenv";
  dotenv.config()
  const apiKey = process.env.API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "tunedModels/personalized-notifications-eutwo5gy04a9",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  

  const getPersonalizedMessage= async ({date,name})=> {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage(
      `Appointment reminder for ${name} on ${date}`,
    );
    console.log(result.response.text());
    return result.response.text();
  }
  
export default getPersonalizedMessage;
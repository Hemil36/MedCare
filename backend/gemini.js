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
    model: "tunedModels/mednotify-proper-lj52zkhsshsf",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "2024-10-14T02:30:00.000+00:00\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Your next appointment is on 2024-10-14 at 02:30 AM. We’ll be waiting! "},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "{'$date': '2025-04-09T13:76:34.000Z'}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Friendly reminder: Your appointment is on 2025-04-09 at 01:76 PM. "},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("{'$date': '2025-04-09T13:76:34.000Z'}");
    console.log(result.response.text());
  }
  
  run();
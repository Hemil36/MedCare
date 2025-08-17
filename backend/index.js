import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middleware/credentials.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/" , (req,res)=>{
  res.status(200).json({message : "Server is Running"})
})

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/route.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

await mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === "http://localhost:5173" || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    optionsSuccessStatus: 200;
  },
};

const credentials = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
};

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.use((err,req, res, next) => {
  res.status(404).send(err);
});
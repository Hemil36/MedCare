import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import routes from "./routes/route.js";
import bodyParser from "body-parser";
import cors from "cors";
import doctor from "./models/Doctor.js";
const app = express();
app.use(express.json());  
mongoose.connect("mongodb+srv://hemildudhat04:hemil04@cluster0.ifcde31.mongodb.net/PatientManagement?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
    });

    app.use(cors())
    // app.use(express.urlencoded({ limit: '50mb', extended: true }));
    // app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
   
    

app.use("/api",routes)


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
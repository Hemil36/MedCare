import doctor from "../models/Doctor.js";
import Patient from "../models/User.js";

export const getPatient = async (req, res) => {

    const { patientID } = req.body;



    try {
        const patient = await Patient.find({patientID});
        res.status(200).json(patient);
    } catch (error) {
       return res.status(404).json({ message: error.message });
    }
}

export const updatePatient = async (req, res) => {
    const { patientID , data } = req.body;
    console.log(patientID , data);
  

    try {
        const patient = await Patient.findOne ({patientID});
        patient.email = data.email;
        patient.phone = data.phone;
        patient.address = data.address;
        patient.occupation = data.occupation;
        patient.emergencyContactName = data.emergencyContactName;
        patient.emergencyPhone = data.emergencyPhone;
        await patient.save();
        res.status(200).json(patient);
    }
    catch (error) {
        return res.status(404).json({ error : "error" });
    }

}

export const patientExist = async (req, res) => {
    const { email } = req.body;
    try {
        const patient = await Patient.find({email});
        const doctor = await doctor.find({email})

       if(patient.length !=0 || doctor.length !=0)
        res.status(400).json("User already exists");

       res.status(200).json("User does not exist");
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
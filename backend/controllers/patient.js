import doctor from "../models/Doctor.js";
import Patient from "../models/User.js";

export const getPatient = async (req, res) => {

    const { patientID } = req.body;
    try {
        const patient = await Patient.findOne({patientID}).select('email phone address occupation emergencyContactName emergencyPhone gender birthDate ');
        if(!patient)
        return res.status(404).json
        ({ message: "Patient not found" });
        
       return res.status(200).json(patient);
    } catch (error) {
       return res.status(404).json({ message: error.message });
    }
}

export const updatePatient = async (req, res) => {
    const { patientID , data } = req.body;  
    if(!patientID)
    return res.status(400).json("Patient ID is required");
console.log(data , patientID);
    if(!data)
    return res.status(400).json("Data is required");

    try {
        const patient = await Patient.findOne({patientID});
        if(!patient)
        return res.status(400).json("Patient not found");
        if (data?.email) patient.email = data.email;
        if (data?.phone) patient.phone = data.phone;
        if (data?.address) patient.address = data.address;
        if (data?.occupation) patient.occupation = data.occupation;
        if (data?.emergencyContactName) patient.emergencyContactName = data.emergencyContactName;
        if (data?.emergencyPhone) patient.emergencyPhone = data.emergencyPhone;       
        console.log(patient)
        await patient.save();

        const removeKeys = ["adhaarNumber", "identificationDocument", "identificationType"];
        const filteredPatient = Object.fromEntries(
          Object.entries(patient._doc).filter(([key]) => !removeKeys.includes(key))
        );
                
        res.status(200).json(filteredPatient);
    }
    catch (error) {
        return res.status(404).json({ error  });
    }

}

export const patientExist = async (req, res) => {
    const { email } = req.body;
    try {
        if(!email)
        return res.status(400).json("Email is required");
        const patient = await Patient.findOne({email});

       if(patient.length !=0 )
        return res.status(400).json("User already exists");

       return res.status(200).json("User does not exist");

    }
    catch (error) {
        return  res.status(400).json({ message: error });
    }
}
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid";
import { customAlphabet } from "nanoid";

const id = nanoid(10);

export const login = async (req, res) => {
    try {
        const { userId,  email, password } = req.body;
        if(!userId ){
            return res.status(400).json({message: "Please enter your userId"});
        }
        if(!password){
            return res.status(400).json({message: "Please enter your  password"});
        }

       const user =  await User.findOne({userId})
         if(!user){
              return res.status(400).json({message: "User does not exist"});
         }

            if(user.password !== password){
                return res.status(400).json({message: "Password is incorrect"});
            }
        
            const acessttoken = jwt.sign({user},"secretKey",{ expiresIn: '1h' })
            const refreshtoken = jwt.sign({user},"refreshKey",{ expiresIn: '1h' })

            res.cookie("jwt", refreshtoken,{
                httpOnly: true,
            })
            res.json({acessttoken})


    }
    catch (error) {
        console.log(error);
    }
}
 function generateCustomId() {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 16);
const randomString = nanoid();



    const formattedId = `${randomString.slice(0, 4)}-${randomString.slice(4, 8)}-${randomString.slice(8, 12)}`;

    return formattedId;
}

export const register = async (req, res) => {

    const {
        name,
        email,
        phone,
        birthDate,
        gender,
        emergencyContactName,
        emergencyPhone,
        currentMedication,
        pastMedicalHistory,
        identificationType,
        adhaarNumber,
        identificationDocument,
        
      } = req.body;
      
    
    try{

        
        const user = await User.findOne({email }) || await User.findOne({phone}) || await User.findOne({adhaarNumber});
        console.log(user);
        if(user){
            return res.status(400).json({ message : "User already exist"});
        }
        const userId = generateCustomId();
        const newUser = new User({ name , email , phone, gender  , userId , adhaarNumber , currentMedication , pastMedicalHistory , identificationDocument , emergencyContactName , emergencyPhone});
        await newUser.save();

        res.status(201).json({message: "User registered successfully" , userId });
    } catch (error) {
        res.status(403).json(error.errmsg);
        console.log(error);
    }
    }
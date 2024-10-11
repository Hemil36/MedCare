import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { getLoading, setdoctorLogin, setHome, setLoading, setLogin, setPatientID } from "@/lib/store/UserSlice";
import { generateOTP, patientExist, verifyDoctor, verifyExistDoctor, verifyUser } from "@/lib/store/AsyncThunks";

const useFormHandler = ({setOpen,type, oldType,newType}) => {


  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const emailVerify = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameVerify = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
  const MedIDVerify = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  const phoneVerify = /^[0-9]{10}$/;
  const {toast} = useToast();
const loading = useSelector(getLoading)

  const validateInputs = (name, email, phone, patientID, doctorID) => {
    const errors = {};
    if (type === 'new') {
      if (!nameVerify.test(name)) errors.name = 'Invalid Name';
      if (!emailVerify.test(email)) errors.email = 'Invalid Email';
      if (!phoneVerify.test(phone)) errors.phone = 'Invalid Phone Number';
    } else {
      if (oldType === 'patient') {
        if (!emailVerify.test(email)) errors.email = 'Invalid Email';
        if (!MedIDVerify.test(patientID)) errors.patientID = 'Invalid MedID';
      } else {
        if (!doctorID) errors.doctorID = 'Invalid DoctorID';
        if (!emailVerify.test(email)) errors.email = 'Invalid Email';
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, PhoneNumber, patientID, doctorID } = e.target;
    console.log(email.value)
    const errors = validateInputs(
      name.value,
      email.value,
      PhoneNumber?.value,
      patientID?.value,
      doctorID?.value
    );
    
    
    console.log("here")
    setError({});
    dispatch(setLoading(true));
    console.log(type , newType)


    try {
      if (type === 'new' && newType === 'patient') {
          await handleNewUserSubmission(email.value, name.value, PhoneNumber.value);
        
      }else if(type === 'new' && newType === 'doctor'){
        await handleDoctorSubmission({email:email.value, name : name.value , PhoneNumber :PhoneNumber.value});
      }
       else if (oldType === 'patient') {
        await handleExistingPatientSubmission(email.value, patientID.value);
    } else {
        await handleExistingDoctorSubmission(email.value, doctorID.value);
      }
    } catch (err) {
      console.log(err);
      toast({ title: 'Error', description: err.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDoctorSubmission = async ({email, name , PhoneNumber}) => {
    dispatch(setHome({ name, email, PhoneNumber }));

    console.log(email)
    try{
    const t =  await dispatch(verifyExistDoctor({ email})).unwrap();
    if(t) throw new Error('Doctor Exists')
    }
    catch(err){
      
     
      toast({ title: 'Doctor Exists', description: 'Doctor already exists' });
      console.log("here")
      return;
    
  }

    await dispatch(generateOTP({ email }));
    setOpen(true);
  }
  

  const handleNewUserSubmission = async (email, name, phone) => {
    dispatch(setHome({ name, email, phone }));

    try{

    const exist = await dispatch(patientExist({ email })).unwrap();

    
    await dispatch(generateOTP({ email }));
    setOpen(true);}
    catch(err){
      
     
        toast({ title: 'User Exists', description: 'User already exists' });
        console.log("here")
        return;
      
    }
  };

  const handleExistingPatientSubmission = async (email, patientID) => {
    
    try{
   await dispatch(verifyUser({ email, patientID })).unwrap();
    

    await dispatch(setLogin({ email, patientID }));
    await dispatch(generateOTP({ email }));
    setOpen(true);
    }
    catch(err){
      console.log(err)
      toast({title : err})
    }
  };

  const handleExistingDoctorSubmission = async (email, doctorID) => {
    try{
    const t =  await dispatch(verifyDoctor({ email, doctorID })).unwrap();
    
    console.log(t)
    }
    catch(err){
      console.log(err)
      toast({title : err})
      return
    }

    await dispatch(setdoctorLogin({ email, doctorID }));
    await dispatch(generateOTP({ email }));
    setOpen(true);

    
  };

  return { handleSubmit, loading, error };
};

export default useFormHandler;

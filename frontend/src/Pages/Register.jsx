import React from 'react'
import {getError, register as Post} from "../lib/store/UserSlice.js"
import Personal from '@/forms/Personal'
import Medical from '@/forms/Medical'
import Identification from '@/forms/Identification'
import Consent from '@/forms/Consent'
import { PatientFormValidation } from '@/forms/validation/patientRegister'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@/lib/store/UserSlice'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const user = useSelector(getUser);

  const {control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PatientFormValidation),
    defaultValues:{
      name: user?.name ||"",
      email: user?.email || "",
      phone : user?.phone ||"",
      birthDate: new Date(),
      gender :"M",
      address: "kjhgfghj",
      occupation: "mjnhbgvfc",
      emergencyContactName: "kjhgfd",
      adhaarNumber: "123456789012",
      identificationType: "Aadhar",
      emergencyPhone: user?.phone || "",
      insuranceProvider: "jjknjknkj",
      insurancePolicyNumber: "nknjknkjnkjnkjnkj",

    }
    
  });
  console.log(errors)
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()
  const error = useSelector(getError)
const navigate = useNavigate ()
  const login = async (e)=>{
    console.log(e)

    setLoading(true)

    try{
     const response =  await dispatch(Post({data: e})).unwrap() 
     
      toast({
        title: "Account Created",
        description: "Your account has been created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      
      })
    }
    catch
    (e){
      console.log(e)
      toast({
            title: "An Error Occoured",
            description: e,
            status: "error",
            duration: 3000,
            isClosable: true,
          
          })

          navigate("/")

    }
    finally{
      setLoading(false)
    }


    
  }
  return (
    <div className="flex h-screen ">

      <section className=" container py-10 remove-scrollbar">

        <h1 className=" text-left text-3xl font-bold w-full">MedID</h1>
        <div className="sub-container max-w-[860px] flex-1 flex-col gap-9 pb-10">
            <div className=' flex flex-col gap-4'>

            <h1 className=" text-3xl font-bold"> Welcome </h1>
            <h3>Let us Know about yourself</h3>
            </div>
            <form onSubmit={handleSubmit(login)}>

            <Personal register={register} control={control} errors={errors} />
            <Medical register={register} errors={errors}/>
            <Identification register={register} errors={errors} control={control}/>
            <Consent register={register} control={control} errors={errors} loading={loading}/>

            </form>
    
            </div>
            </section>
            </div>
  )
}

export default Register
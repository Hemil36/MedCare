import React, { useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Doctor from '@/forms/Doctor';
import DoctorPersonal from '@/forms/DoctorPersonal';
import Identification from '@/forms/Identification';
import Consent from '@/forms/Consent';
import { DoctorFormValidation } from '@/forms/validation/doctorRegister';
import { useDispatch, useSelector } from 'react-redux';
import { register as regis }  from '@/lib/store/AsyncThunks';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { getName, getUser } from '@/lib/store/UserSlice';
import { useDropzone } from "react-dropzone";

const RegisterDoctor = () => {

  
 
  const user = useSelector(getUser)

    const {control,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(DoctorFormValidation),
        defaultValues:{
          name: user?.name ||"",
          email: user?.email || "",
          phone : user?.phone ||"",
    
        }
      });

      const loading = false
      console.log(errors)
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const onSubmit = async (e) => {
        console.log(e)


        try{
          await dispatch(regis({data: e , type :"doctor"}));

          toast({
            title: "Doctor Registered Successfully",
          })

          navigate("/")

          console.log(e)
        }
        catch(err){
          console.log("here")
          console.log(err)
        }


      }

  return (
    <div className="flex h-screen ">

    <section className=" container py-10 remove-scrollbar">

      <h1 className=" text-left text-3xl font-bold w-full">MedID</h1>
      <div className="sub-container max-w-[860px] flex-1 flex-col gap-9 pb-10">
        <form onSubmit={handleSubmit(onSubmit)}>

        <DoctorPersonal register={register} control={control} errors={errors} />
        <Doctor register={register} control={control} errors={errors} />
        <Identification register={register} errors={errors} control={control}/>
        <Consent register={register} control={control} errors={errors} loading={loading} type="doctor"/>
        </form>


        </div>
        </section>
        </div>
  )
}

export default RegisterDoctor
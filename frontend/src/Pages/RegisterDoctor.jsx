import React from 'react'
import PatientForm from './PatientForm'
import Personal from '@/forms/Personal'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Doctor from '@/forms/Doctor';
import DoctorPersonal from '@/forms/DoctorPersonal';

const RegisterDoctor = () => {
    const {control,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(),
        defaultValues:{
        
    
        }
        
      });

  return (
    <div className="flex h-screen ">

    <section className=" container py-10 remove-scrollbar">

      <h1 className=" text-left text-3xl font-bold w-full">MedID</h1>
      <div className="sub-container max-w-[860px] flex-1 flex-col gap-9 pb-10">
        <DoctorPersonal register={register} control={control} errors={errors} />
        <Doctor register={register} control={control} errors={errors} />
        </div>
        </section>
        </div>
  )
}

export default RegisterDoctor
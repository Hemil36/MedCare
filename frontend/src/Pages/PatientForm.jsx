import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { setHome } from "@/lib/store/UserSlice";
import { cn } from "@/lib/utils";
import { User , Phone, Mail ,OctagonX} from "lucide-react";


import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const PatientForm = () => {
  const {toast} = useToast();
  const emailVerify = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const nameVerify = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/
  const phoneVerify = /^[0-9]{10}$/
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error , setError] = useState({
    name:"",
    email:"",
    phone:""
  })

 
  useEffect(() => {
    toast({
      title: "Welcome",
      description: "Welcome to MedID",
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setHome({name: e.target.name.value, email: e.target.email.value, phone: e.target.PhoneNumber.value}));
    navigate("/register");
    const Error={
      name:"",
    email:"",
    phone:""
    }

    if(!nameVerify.test(e.target.name.value)){

      Error.name="Invalid Name"
    }
    if(!emailVerify.test(e.target.email.value)){
      Error.email="Invalid Email"
    }

    if(!phoneVerify.test(e.target.PhoneNumber.value)){
      Error.phone="Invalid Phone Number"
    }

    if(Error.name || Error.email || Error.phone){
      return setError(Error)
    }
    else{
      console.log("submitted")
      setError({
        name:"",
        email:"",
        phone:""
      })
    }

    
  
  };


  const { setTheme } = useTheme();
  return (
    <div>
      <div className=" py-4">
        <h1 className=" text-3xl">Welcome to MedID</h1>
      </div>
<form onSubmit={handleSubmit}>

      <div className=" flex-1 text-gray-500 my-2">
        <Label htmlFor="name" className="flex" >
          <span className={cn('',{'text-red-700' : error.name})}> {!error.name ? "Name" : error.name}</span>
        </Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <User className="ml-2 " color="#ffffff" />
          <Input
            id="name"
            placeholder="Enter your name"
            className=" border-0 shad-input text-zinc-100 font-normal"
          />
        </div>
      </div>
      <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="email" >
          <span className={cn('',{'text-red-700' : error.email})}> {!error.email ? "Email Address" : error.email} </span>
        </Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <Mail className="ml-2 " color="#ffffff" />
          <Input
            id="email"
            placeholder="Enter your email"
            className=" border-0 shad-input text-zinc-100 font-normal"
            autoComplete="off"
          />
        </div>
      </div>
      <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="PhoneNumber" >
          <span className={cn('',{'text-red-700' : error.phone})} >{!error.phone ? "Phone Number" : error.phone}</span>
        </Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <Phone className="ml-2 " color="#ffffff" />
          <Input
            id="PhoneNumber"
            placeholder="Enter your Phone Number"
            className=" border-0 shad-input text-zinc-100 font-normal"
            autoComplete="off"
          />
        </div>
        </div>
        <Button type="submit" className="mt-4 shad-primary-btn w-full" >
          Get Started </Button>
        </form>
     
      <Button onClick={() => setTheme("dark")}>Submit</Button>
      <Button onClick={() => setTheme("light")}>light</Button>
    </div>
  );
};

export default PatientForm;

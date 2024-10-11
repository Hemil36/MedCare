import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getLoading, setHome, setLogin, setPatientID } from "@/lib/store/UserSlice";
import { generateOTP, patientExist, verifyUser } from "@/lib/store/AsyncThunks";
import { cn } from "@/lib/utils";
import { User, Phone, Mail, OctagonX, Loader } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFormHandler from "@/forms/validation/home";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PatientForm = ({ setOpen,  type, setType , setOldType , setNewType , oldType , newType }) => {
 
  const { toast } = useToast();
  const emailVerify = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameVerify = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
  const MedIDVerify = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  const phoneVerify = /^[0-9]{10}$/;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(getLoading);


  
  useEffect(() => {
    toast({
      title: "Welcome",
      description: "Welcome to MedID",
    });
  }, []);

  const {handleSubmit ,error } = useFormHandler({setOpen,type, oldType, newType});

 
  return (
    <div>
      <div className=" py-4">
        <h1 className=" text-3xl">Welcome to MedID</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {type === "new" && (
          <>
            <Tabs
              defaultValue="patient"
              className="w-[400px] mx-auto md:mx-0"
              onValueChange={(e) => setNewType(e)}
            >
              <TabsList>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className=" flex-1 text-gray-500 my-2">
              <Label htmlFor="name" className="flex">
                <span className={cn("", { "text-red-700": error.name })}>
                  {" "}
                  {!error.name ? "Name" : error.name}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <User className="ml-2 " color="#ffffff" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="email">
                <span className={cn("", { "text-red-700": error.email })}>
                  {" "}
                  {!error.email ? "Email Address" : error.email}{" "}
                </span>
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
              <Label htmlFor="PhoneNumber">
                <span className={cn("", { "text-red-700": error.phone })}>
                  {!error.phone ? "Phone Number" : error.phone}
                </span>
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
            <Button type="submit" className="mt-4 shad-primary-btn w-full">
              {loading ? (
                <>
                  <Loader className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </>
        )}

        {type === "old" && (
          <>
            <Tabs
              defaultValue="patient"
              className="w-[400px] mx-auto md:mx-0"
              onValueChange={(e) => setOldType(e)}
            >
              <TabsList>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
              </TabsList>
              <TabsContent value="patient">
                <div className=" flex-1 text-gray-500 my-2">
                  <Label htmlFor="name" className="flex">
                    <span
                      className={cn("", { "text-red-700": error.patientID })}
                    >
                      {" "}
                      {!error.patientID ? "MedID" : error.patientID}
                    </span>
                  </Label>
                  <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                    <User className="ml-2 " color="#ffffff" />
                    <Input
                      id="patientID"
                      placeholder="Enter your name"
                      className=" border-0 shad-input text-zinc-100 font-normal"
                    />
                  </div>
                </div>
                <div className=" flex-1 text-gray-400 my-2">
                  <Label htmlFor="email">
                    <span className={cn("", { "text-red-700": error.email })}>
                      {" "}
                      {!error.email ? "Email Address" : error.email}{" "}
                    </span>
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
                <Button type="submit" className="mt-4 shad-primary-btn w-full">
                  {loading ? (
                    <>
                      <Loader className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </TabsContent>
              <TabsContent value="doctor">
                <div className=" flex-1 text-gray-500 my-2">
                  <Label htmlFor="name" className="flex">
                    <span
                      className={cn("", { "text-red-700": error.doctorID })}
                    >
                      {!error.doctorID ? "DoctorID" : error.doctorID}
                    </span>
                  </Label>
                  <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                    <User className="ml-2 " color="#ffffff" />
                    <Input
                      id="doctorID"
                      name="doctorID"
                      placeholder="Enter your name"
                      className=" border-0 shad-input text-zinc-100 font-normal"
                    />
                  </div>
                </div>
                <div className=" flex-1 text-gray-400 my-2">
                  <Label htmlFor="email">
                    <span className={cn("", { "text-red-700": error.email })}>
                      {" "}
                      {!error.email ? "Email Address" : error.email}{" "}
                    </span>
                  </Label>
                  <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                    <Mail className="ml-2 " color="#ffffff" />
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      className=" border-0 shad-input text-zinc-100 font-normal"
                    />
                  </div>
                </div>
                 

                <Button type="submit" className="mt-4 shad-primary-btn w-full">
                  {loading ? (
                    <>
                      <Loader className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </TabsContent>
         <Link to="/forgotId" className="text-green-500">
                  Forgot ID
                  </Link>
            </Tabs>
          </>
        )}
      </form>
      {type === "new" ? (
        <Button className=" mt-2" onClick={() => setType("old")}>
          Login
        </Button>
      ) : (
        <Button onClick={() => setType("new")}>Sign Up</Button>
      )}
    </div>
  );
};

export default PatientForm;

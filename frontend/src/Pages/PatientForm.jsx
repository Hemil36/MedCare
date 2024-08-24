import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { setHome, setLogin, setPatientID } from "@/lib/store/UserSlice";
import { generateOTP, patientExist, verifyUser } from "@/lib/store/AsyncThunks";
import { cn } from "@/lib/utils";
import { User, Phone, Mail, OctagonX, Loader } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PatientForm = ({ setOpen, loading, setLoading, type, setType }) => {
  const { toast } = useToast();
  const emailVerify = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameVerify = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
  const MedIDVerify = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  const phoneVerify = /^[0-9]{10}$/;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldType, setOldType] = useState();
  const [newSignup, setNewSignup] = useState(false);
  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    patientID: "",
    doctorID: "",
  });
  useEffect(() => {
    toast({
      title: "Welcome",
      description: "Welcome to MedID",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Error = {
      name: "",
      email: "",
      phone: "",
      patientID: "",
      doctorID: "",
    };

    if (type === "new") {
      if (!nameVerify.test(e.target.name.value)) {
        Error.name = "Invalid Name";
      }
      if (!emailVerify.test(e.target.email.value)) {
        Error.email = "Invalid Email";
      }

      if (!phoneVerify.test(e.target.PhoneNumber.value)) {
        Error.phone = "Invalid Phone Number";
      }

      if (Error.name || Error.email || Error.phone) {
        return setError(Error);
      } else {
        dispatch(
          setHome({
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.PhoneNumber.value,
          })
        );

        try {
          setLoading(true);
          console.log(e.target.email.value);
          const exist = await dispatch(
            patientExist({ email: e.target.email.value })
          );
          if (exist.payload) {
            toast({
              title: "User Exists",
              description: "User already exists",
            });
            setLoading(false);
            return;
          }
          setOpen(true);
          console.log("jio");

          const t = await dispatch(
            generateOTP({ email: e.target.email.value })
          );

          console.log(t);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      if (oldType === "patient") {
        if (!emailVerify.test(e.target.email.value)) {
          Error.email = "Invalid Email";
        }
        if (!MedIDVerify.test(e.target.patientID.value)) {
          Error.patientID = "Invalid MedID";
        }

        if (Error.email || Error.patientID) {
          return setError(Error);
        }
        setLoading(true);
        console.log(e.target.patientID.value);

        try {
          const a = await dispatch(
            verifyUser({
              email: e.target.email.value,
              patientID: e.target.patientID.value,
            })
          ).unwrap();

          await dispatch(
            setLogin({
              email: e.target.email.value,
              patientID: e.target.patientID.value,
            })
          );
          const t = await dispatch(
            generateOTP({ email: e.target.email.value })
          );
          console.log(t);

          setOpen(true);
        } catch (e) {
          toast({
            title: "Invalid Credentials",
            description: "Please check your credentials",
          });

          console.log(e);
        } finally {
          setLoading(false);
        }
      } else {
        console.log(e.target.doctorID.value)
        if (!e.target.doctorID.value) {
          Error.doctorID = "Invalid DoctorID";
        }
        if (!emailVerify.test(e.target.email.value)) {
          Error.email = "Invalid Email";
        }
        setError(Error);
      }
    }
  };

  const { setTheme } = useTheme();
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
              onValueChange={(e) => setNewSignup(e)}
            >
              <TabsList>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="Doctor">Doctor</TabsTrigger>
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
                <TabsTrigger value="Doctor">Doctor</TabsTrigger>
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
              <TabsContent value="Doctor">
                <div className=" flex-1 text-gray-500 my-2">
                  <Label htmlFor="name" className="flex">
                    <span
                      className={cn("", { "text-red-700": error.doctorID })}
                    >
                      {console.log(error)}
                      {!error.doctorID ? "DoctorID" : error.doctorID}
                    </span>
                  </Label>
                  <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                    <User className="ml-2 " color="#ffffff" />
                    <Input
                      id="doctorid"
                      name="doctorid"
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

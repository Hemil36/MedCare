import React, { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarArrowDown,
  CalendarRange,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as Shad } from "@/components/ui/calendar";
import "react-day-picker/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroupItem as Hip,
  RadioGroup as Hipo,
} from "@/components/ui/radio-group";

import { Controller, useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getpatientID, getProfile, getUser, setProfile, setUser } from "@/lib/store/UserSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormValidation } from "@/forms/validation/patientRegister";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import {  getuser, updatePatient } from "@/lib/store/AsyncThunks";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { profileValidation } from "@/forms/validation/UpdateProfile";

const UserProfile = React.memo(function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(getProfile,shallowEqual);
  const patientID = useSelector(getpatientID,shallowEqual)
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const error = {};
 console.log("rendered")
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await dispatch(updatePatient({ patientID: user.patientID, data }));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
      });

      dispatch(setProfile(data));
    } catch (e) {
      toast({
        title: "An Error Occurred",
        description: "Something went wrong while updating your profile.",
        status: "error",
        duration: 3000,
      });
    }
  };


  const [date, setDate] = useState(user?.birthDate);
  const t2 = useCallback(async () => {
    const user2 = await dispatch(getuser({ patientID }));
    console.log(user2);
    dispatch(setProfile(user2.payload[0]));
    startTransition(() => {
      setUserDetails(user2.payload[0]);
      setLoading(false);
      reset({
        name: user2.payload[0].name,
        email: user2.payload[0].email,
        phone: user2.payload[0].phone,
        birthDate: user2.payload[0].birthDate,
        gender: user2.payload[0].gender,
        address: user2.payload[0].address,
        occupation: user2.payload[0].occupation,
        emergencyContactName: user2.payload[0].emergencyContactName,
        emergencyPhone: user2.payload[0].emergencyPhone,
    });
  });
}, [dispatch, patientID]);

useEffect(() => {
    t2();
}, [t2]);
 

  const errors={}
  const { control, handleSubmit , register,reset} = useForm({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: userDetails?.phone,
      birthDate: userDetails?.birthDate,
      gender: userDetails?.gender,
      address: userDetails?.address,
      occupation: userDetails?.occupation,
      emergencyContactName: userDetails?.emergencyContactName,
      emergencyPhone: userDetails?.emergencyPhone,
    },
  });

//

  
  if (loading) {
    return <div>Loading...</div>;
}

  return (
    <div className="h-full w-full pt-7 overflow-auto remove-scrollbar container">
      <h1 className="text-4xl font-semibold mb-3">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-auto ">
      <div className="overflow-auto =">
        <div className="flex flex-col gap-2">
          
          <div className=" flex-1 text-gray-400 my-2">
            <Label htmlFor="name">
              <span className={cn("", { "text-red-700": error.name })}>
                {" "}
                Full Name{" "}
              </span>
            </Label>
            <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
              <User className="ml-2 " color="#ffffff" />
              <Input
                id="name"
                placeholder="ex Jane Doe"
                className=" border-0 shad-input text-zinc-100 font-normal"
                autoComplete="off"
                disabled
                value={user.name}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-red-700"> {errors.name.message} </span>
            )}
          </div>
          <div className=" flex  flex-col md:flex-row  gap-2">
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
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <span className="text-red-700"> {errors.email.message} </span>
              )}
            </div>
            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="phone">
                <span className={cn("", { "text-red-700": error.phone })}>
                  {" "}
                  {!error.phone ? "Phone number" : error.phone}{" "}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <Phone className="ml-2 " color="#ffffff" />
                <Input
                  id="phone"
                  placeholder="Enter your phone"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <span className="text-red-700"> {errors.phone.message} </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
          

            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="phone">
                <span className={cn("", { "text-red-700": error.phone })}>
                  Gender
                </span>
              </Label>
              <div className=" flex items-center flex-row rounded-md mt-1  ">
                <Controller
                  name="gender"
                  control={control}
                  defaultValue={user?.gender}
                  render={({ field }) => (
                    <Hipo
                      className="flex h-11 gap-6 justify-center xl:justify-between  j"
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled
                    >
                      <div className="radio-group">
                        <Hip id="male" value="M"></Hip>
                        <Label htmlFor="male">Male</Label>
                        <Hip id="female" value="F"></Hip>
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </Hipo>
                  )}
                />
              </div>
              {errors.gender && (
                <span className="text-red-500"> {errors.gender.message} </span>
              )}
            </div>
          </div>

          <div className=" flex gap-2 flex-col md:flex-row">
            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="address">
                <span className={cn("", { "text-red-700": error.address })}>
                  {" "}
                  {!error.address ? " Address" : error.address}{" "}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <Input
                  id="address"
                  placeholder="Enter your address"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  {...register("address")}
                />
              </div>
              {errors.address && (
                <span className="text-red-700"> {errors.address.message} </span>
              )}
            </div>
      
          </div>

          <div className=" flex gap-2 flex-col md:flex-row">
            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="emergencyName">
                <span
                  className={cn("", { "text-red-700": error.emergencyName })}
                >
                  {" "}
                  {!error.emergencyName
                    ? " Emergency Contact Person"
                    : error.emergencyName}{" "}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <Input
                  id="emergencyName"
                  placeholder="Enter your emergency Name"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  {...register("emergencyContactName")}
                />
              </div>
              {errors.emergencyContactName && (
                <span className="text-red-700">
                  {" "}
                  {errors.emergencyContactName.message}{" "}
                </span>
              )}
            </div>
            <div className=" flex-1 text-gray-400 my-2">
              <Label htmlFor="emergencyPhone">
                <span
                  className={cn("", { "text-red-700": error.emergencyPhone })}
                >
                  {" "}
                  {!error.emergencyPhone
                    ? "Emergency Phone Number"
                    : error.emergencyPhone}{" "}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <Phone className="ml-2 " color="#ffffff" />
                <Input
                  id="occupation"
                  placeholder="Enter emergency Phone Number"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  {...register("emergencyPhone")}
                />
              </div>
              {errors.emergencyPhone && (
                <span className="text-red-700">
                  {" "}
                  {errors.emergencyPhone.message}{" "}
                </span>
              )}
            </div>
          </div>

          {/* <FormField type="name" error={error} message="invalid emergencyPhone" placeholder="Enter name" /> */}
        </div>
        <Button className="bg-green-500 text-white w-[5rem] my-3" type="submit" >Update </Button>
        
      </div>
      
        </div>
      </form>
    </div>
  );
});

// The component is now memoized, and it will only re-render if its props change
export default UserProfile;
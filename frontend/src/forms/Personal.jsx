/* eslint-disable no-unused-vars */
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
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as Shad } from "@/components/ui/calendar";
import "react-day-picker/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem as Hip , RadioGroup as Hipo } from "@/components/ui/radio-group";

import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { getUser } from "@/lib/store/UserSlice";

const Personal = ({register,control,errors}) => {
  const error = {};
  const [date, setDate] = React.useState(new Date());
  
  return (
    <div className="flex flex-col gap-2">
      <h1 className=" text-3xl font-bold"> Personal Information</h1>
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
            {...register("name")}
          />
        </div>
          {
            errors.name && <span className="text-red-700"> {errors.name.message} </span>
          }
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
          {
            errors.email && <span className="text-red-700"> {errors.email.message} </span>
          }
        </div>
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="phone">
            <span className={cn("", { "text-red-700": error.phone })}>
              {" "}
              {!error.phone ? "Phone number" : error.phone}{" "}
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Phone className="ml-2 " color="#ffffff" />  <div className=" flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
           
          </div>
            <Input
              id="phone"
              placeholder="Enter your phone"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("phone")}
            />
          </div>
          {
            errors.phone && <span className="text-red-700"> {errors.phone.message} </span>
          }
        </div>
      </div>

<div className="flex flex-col md:flex-row gap-2">
<div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="name">
            <span className={cn("", { "text-red-700": error.name })}>
              {" "}
              Date of Birth{" "}
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Calendar className="ml-2 " color="#ffffff" />

            <Controller
              name="birthDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <DatePicker
                  selected={date}
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    field.onChange(formattedDate);
                    setDate(date);
                  }}
                  className="text-sm"
                  placeholderText="Select Date"
                />
              )}
            />
          </div>
          {errors.birthDate && (
            <span className="text-red-700"> {errors.birthDate.message} </span>
          )}
        </div>


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
              defaultValue=""
              render={({ field }) => (
                
         <Hipo className="flex h-11 gap-6 justify-center xl:justify-between  j" onValueChange={field.onChange} value={field.value}>
          <div className="radio-group">

          <Hip id="male"  value="M">
            </Hip>
            <Label htmlFor="male">
              Male
            </Label>
            <Hip id="female"  value="F">
            </Hip>
            <Label htmlFor="female">
              Female
            </Label>
            </div>
         </Hipo>
              )}
            />
          
          </div>
          {
            errors.gender && <span className="text-red-500"> {errors.gender.message} </span>
          }
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
        {
            errors.address && <span className="text-red-700"> {errors.address.message} </span>
        }
        </div>
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="Occupation">
            <span className={cn("", { "text-red-700": error.Occupation })}>
              {" "}
              {!error.Occupation ? "Occupation" : error.Occupation}{" "}
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Input
              id="occupation"
              placeholder="Enter your occupation"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("occupation")}
            />
          </div>
          {
            errors.occupation && <span className="text-red-700"> {errors.occupation.message} </span>
          }
        </div>
      </div>



      <div className=" flex gap-2 flex-col md:flex-row">
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="emergencyName">
            <span className={cn("", { "text-red-700": error.emergencyName })}>
              {" "}
              {!error.emergencyName ? " Emergency Contact Person" : error.emergencyName}{" "}
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
          {
            errors.emergencyContactName && <span className="text-red-700"> {errors.emergencyContactName.message} </span>
          }
        </div>
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="emergencyPhone">
            <span className={cn("", { "text-red-700": error.emergencyPhone })}>
              {" "}
              {!error.emergencyPhone ? "Emergency Phone Number" : error.emergencyPhone}{" "}
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
          {
            errors.emergencyPhone && <span className="text-red-700"> {errors.emergencyPhone.message} </span>
          
          }
        </div>
      </div>


      {/* <FormField type="name" error={error} message="invalid emergencyPhone" placeholder="Enter name" /> */}
    </div>
  );
};

export default Personal;

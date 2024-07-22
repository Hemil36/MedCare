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


import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const Medical = ({register,errors}) => {
  const error = {};
  const [date, setDate] = React.useState(new Date());
  return (
    <div className="flex flex-col gap-2 py-4">
      <h1 className=" text-3xl font-bold"> Medical Information</h1>
      
      <div className=" flex gap-2 flex-col md:flex-row">
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="insuranceProvider">
            <span >
             Insurance provider
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Mail className="ml-2 " color="#ffffff" />
            <Input
              id="insuranceProvider"
              placeholder="ex: Bajaj"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("insuranceProvider")}

            />
          </div>
          {
            errors.insuranceProvider && <span className="text-red-700"> {errors.insuranceProvider.message}</span>
          }
        </div>
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="insurancePolicyNumber">
            <span >
              {!error.insuarencePolicy ? "Insuarence Policy number" : error.insuarencePolicy}{" "}
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Input
              id="insurancePolicyNumber"
              placeholder="Insuarence Policy Number"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("insurancePolicyNumber")}
            />
          </div>
          {
            errors.insurancePolicyNumber && <span className="text-red-700"> {errors.insurancePolicyNumber.message}</span>
          }
        </div>
      </div>



<div className=" flex gap-2 flex-col md:flex-row">
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="currentMedication">
            <span >Current Medication            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Textarea
              id="CurrentMedication"
              placeholder="current Medications"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("currentMedication")}
            />
          </div>
         
        </div>
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="pastMedicalHistory">
            <span >
              {" "}
              Past Medical History
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Textarea
              id="occupation"
              placeholder="ex: Asthma diagnosis in childhood"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("pastMedicalHistory")}
            />
          </div>

        </div>
      </div>



     


      {/* <FormField type="name" error={error} message="invalid emergencyPhone" placeholder="Enter name" /> */}
    </div>
  );
};

export default Medical;

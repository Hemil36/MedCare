import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar, Gem, GraduationCap, User } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

const Doctor = ({ register, errors, control }) => {
  const [error, setError] = React.useState({});
  const [date, setDate] = React.useState(new Date());
  return (
    <div>
      <h1 className=" text-3xl font-bold">Professional Credentials</h1>
      <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="councilID">
          <span className={cn("", { "text-red-700": error.councilID })}>
            Medical Council ID:
          </span>
        </Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <User className="ml-2 " color="#ffffff" />
          <Input
            id="councilID"
            placeholder="ex Jane Doe"
            className=" border-0 shad-input text-zinc-100 font-normal"
            autoComplete="off"
            {...register("councilID")}
          />
        </div>
        {errors.councilID && (
          <span className="text-red-700">
            {" "}
            {errors.councilID.message}{" "}
          </span>
        )}
      </div>
      <div className=" flex-1 text-gray-400 my-2">

      <Label htmlFor="graduationYear">
        {" "}
        <span>Graduation Date</span>
      </Label>
      <div className=" flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
        <Calendar className="ml-2 " color="#ffffff" />

        <Controller
          name="graduationYear"
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
      </div>
      <div className=" flex-1 text-gray-400 my-2">

      <Label htmlFor="degree">
        <span className={cn("", { "text-red-700": error.degree })}>
          Degree
        </span>
        </Label>
      <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
        <GraduationCap className="ml-2 " color="#ffffff" />
        <Input
          id="degree"
          placeholder="ex Jane Doe"
          className=" border-0 shad-input text-zinc-100 font-normal"
          autoComplete="off"
          {...register("degree")}
        />
      </div>
        {
          errors.degree && (
            <span className="text-red-700">
              {" "}
              {errors.degree.message}{" "}
            </span>
          )
        }
        </div>
        <div className=" flex-1 text-gray-400 my-2">

      <Label htmlFor="speciality">
        <span className={cn("", { "text-red-700": error.speciality })}>
          Speciality
        </span>
        </Label>
      <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
        <Gem className="ml-2 " color="#ffffff" />
        <Input
          id="speciality"
          placeholder="ex Jane Doe"
          className=" border-0 shad-input text-zinc-100 font-normal"
          autoComplete="off"
          {...register("speciality")}
        />
      </div>
      {
        errors.speciality && (
          <span className="text-red-700">
            {" "}
            {errors.speciality.message}{" "}
          </span>
        )
      }
      </div>
      <div className=" flex gap-2 flex-col md:flex-row">
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="clinicaddress">
            <span className={cn("", { "text-red-700": error.clinicaddress })}>
              {" "}
              {!error.clinicaddress ? " Address" : error.clinicaddress}{" "}
            </span>
          </Label>
          <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Input
              id="clinicaddress"
              placeholder="Enter your clinicaddress"
              className=" border-0 shad-input text-zinc-100 font-normal"
              autoComplete="off"
              {...register("clinicaddress")}
            />
          </div>
          {errors.clinicaddress && (
            <span className="text-red-700"> {errors.clinicaddress.message} </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;

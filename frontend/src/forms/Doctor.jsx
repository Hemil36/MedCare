import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from "@/components/ui/label";
import { Calendar, User } from 'lucide-react'
import React from 'react'
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';

const Doctor = ({register,errors,control}) => {
    const [error, setError] = React.useState({})
    const [date, setDate] = React.useState(new Date());
  return (
    <div>
        <h1 className=" text-3xl font-bold">Professional Credentials</h1>
        <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="registrationID">
          <span className={cn("", { "text-red-700": error.registrationID })}>
          Medical Council Registration ID:

          </span>
        </Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <User className="ml-2 " color="#ffffff" />
          <Input
            id="registrationID"
            placeholder="ex Jane Doe"
            className=" border-0 shad-input text-zinc-100 font-normal"
            autoComplete="off"
            {...register("registrationID")}
          />
        </div>
          {
            errors.registrationID && <span className="text-red-700"> {errors.registrationID.message} </span>
          }
      </div>
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
                    const formattedDate = date ? date.toISOString().split('T')[0] : '';
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
  )
}

export default Doctor
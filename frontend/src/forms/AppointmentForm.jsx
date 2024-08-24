import { Calendar, Loader } from 'lucide-react';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import HoverCard1 from '@/components/hoverCard';
import DatePicker from 'react-datepicker';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/components/ui/use-toast';
import { approveAppointment, cancelAppointment, scheduleAppointment } from '@/lib/store/AsyncThunks';
import { useNavigate } from 'react-router-dom';
import { setLoading as op  , loading as loadc} from '@/lib/store/UserSlice';


const AppointmentForm = ({type , appointment,setOpen,l}) => {
    const [date, setDate] = React.useState( new Date());
    const [loading, setLoading] = React.useState(false);
    const load = useSelector(loadc)
    const k = !load;
    const {control,
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({})

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async (data) => {

      if(type === "schedule" ){

      try {
        setLoading(true)
        const response = await dispatch(approveAppointment({appointmentID : appointment?._id , date : data.schedule})).unwrap();
        const event = new Event('appointmentDataChanged');
        window.dispatchEvent(event);
        setLoading(false)
        setOpen(false)

        toast({
          title: "Success",
          message: "Appointment Scheduled",
          type: "success",

        })

      }
      catch(e){
        toast({
          title: "Error",
          message: "Error scheduling appointment",
          type: "error",

        })
      }
    }

    if(type === "cancel" ){
      console.log("cancelled")

      try {
        setLoading(true)
        const response = await dispatch(cancelAppointment({appointmentID : appointment?._id })).unwrap();
        const event = new Event('appointmentDataChanged');
        window.dispatchEvent(event);
        
        setTimeout(()=>{},2000)
        setTimeout(()=>{},2000)
        
        setLoading(false)
        
        setOpen(false)

        toast({
          title: "Success",
          message: "Appointment Cancelled",
          type: "success",

        })

      }
      catch(e){
        toast({
          title: "Error",
          message: "Error scheduling appointment",
          type: "error",

        })
      }
    }

    }
    
  return (
<form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex flex-col gap-5 ">

          { type === "schedule" && <div className=" flex-1 text-gray-400 my-2">
            <Label htmlFor="Doctor">
              <span>Select Appointment Date</span>
            </Label>
            <div className=" flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2 border-2 border-green-500  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <Calendar className="ml-2 " color="#ffffff" />
            
             <Controller
              name="schedule"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <DatePicker
                  selected={date}
                  showTimeSelect={true}
                  minDate={new Date()}
                  maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                  onChange={(date) => {
                    field.onChange(date);
                    setDate(new Date(date));
                  }}
                  className="text-sm font-bold scroll-p-0 "
                  placeholderText="Select Date"
                  dateFormat="MM/dd/yyyy-h:mm aa"
                />
              )}
            />
              
          </div>
            {
              errors.schedule && <span className="text-red-500 text-sm">{errors.schedule.message}</span>
            }
            </div>
                      }

            <Button className={cn("text-white rounded-md p-2 m-2 w-full" ,{"bg-green-500 " : type === "schedule" ,"bg-red-400" : type ==="cancel"} )} type="submit">

          {loading ? <>
          <Loader className='animate-spin' />
          Loading...
          
          </>: type === "schedule" ? "Schedule Appointment" : "Cancel Appointment" }
          </Button>

        </div>
        </form>
  )
}

export default AppointmentForm
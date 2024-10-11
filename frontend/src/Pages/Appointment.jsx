"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader, Mail, Search } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
import TimePicker from "@ashwinthomas/react-time-picker-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/Select.jsx";
import HoverCard from "@/components/hoverCard";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppointmentSchema } from "@/forms/validation/appointmentValidation";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointment,
  getDoctor,
  scheduleAppointment,
} from "@/lib/store/AsyncThunks";
import {
  getEmail,
  getName,
  getpatientID,
  getSearch,
  setDoctorName,
  setSearch,
} from "@/lib/store/UserSlice";
import { set } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Appointment = ({ type }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getAppointmentSchema(type)),
    defaultValues: {
      schedule: new Date(),
    },
  });

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [doctor, setDoctor] = React.useState(null);
  const [select, setSelect] = React.useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        await dispatch(setSearch(""));
        const response = await dispatch(getDoctor()).unwrap();
        setDoctor(response);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  const patientID = useSelector(getpatientID);
  const patientName = useSelector(getName);
  const email = useSelector(getEmail)
  console.log(errors);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const doc = doctor?.find((doc)=>{return doc.doctorId === data.doctor })
      console.log(doc)
    
      const appointmentID = await dispatch(
        scheduleAppointment({
          doctorID: data.doctor,
          patientID,
          date,
          address: doc.clinicAddress,
          patientName,
          doctorName : doc.name,
          email
        })
      ).unwrap();

      dispatch(setDoctorName(doc.name));

      navigate(
        `/patient/${patientID}/appointment/success?appointmentID=${appointmentID}`
      );
    } catch (e) {
      console.log(e)
      toast({
        title: "Error",
        description: "Try Again after some time",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(true);
  };
  const search = useSelector(getSearch);
  return (
    <div className="flex h-screen ">
      <section className=" container py-10 remove-scrollbar">
        <h1 className=" text-left text-3xl font-bold w-full">MedID</h1>
        <div className="sub-container max-w-[860px] flex-1 flex-col gap-9 pb-10">
          <h1 className=" text-3xl font-bold">Request a new Appointment</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" flex flex-col gap-5">
              <div className=" flex-1 text-gray-400 my-2">
                <Label htmlFor="Doctor">
                  <span>Doctor</span>
                </Label>
                <Controller
                  name="doctor"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      onValueChange={(e) => {
                        console.log(e);
                        field.onChange(e);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="shad-select-trigger">
                        {field.value
                          ? doctor.find((doc) => doc.doctorId == field.value)
                              .name
                          : "Select Doctor"}
                      </SelectTrigger>
                      <SelectContent className="shad-select-content  ">
                        {doctor &&
                          doctor
                            .filter((doc) =>
                              doc.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            )
                            .map((doc) => (
                              <HoverCard
                                key={doc.doctorId}
                                value={doc.doctorId}
                                doctor={doc}
                                className="hover-card"
                              />
                            ))}
                          
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.doctor && (
                  <span className="text-red-500 text-sm">
                    {errors.doctor.message}
                  </span>
                )}
              </div>
              <div className=" flex-1 text-gray-400 my-2">
                <Label htmlFor="Doctor">
                  <span>Select Appointment Date</span>
                </Label>
                <div className=" flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                  <Calendar className="ml-2 " color="#ffffff" />

                  <Controller
                    name="schedule"
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
                        dateFormat="MM/dd/yyyy "
                      />
                    )}
                  />
                </div>
                {errors.schedule && (
                  <span className="text-red-500 text-sm">
                    {errors.schedule.message}
                  </span>
                )}
              </div>
              <Button
                className={cn("text-white rounded-md p-2 m-2 w-full", {
                  "bg-green-500 ": type === "create",
                  "bg-red-400": type === "cancel",
                })}
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" />
                    Loading...
                  </>
                ) : type === "create" ? (
                  "Schedule Appointment"
                ) : (
                  "Cancel Appointment"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Appointment;

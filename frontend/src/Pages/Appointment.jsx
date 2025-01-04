"use client";
import { Label } from "@/components/ui/label";
import { Calendar, Loader, Mail, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"; // Replace with your accordion component paths

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
import { set, setHours, setMinutes } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Appointment = ({ type }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getAppointmentSchema(type)),
    defaultValues: {
      schedule: new Date(),
      doctor: null,
    },
  });

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [speciality, setSpeciality] = React.useState("");
  const [doctor, setDoctor] = React.useState(null);
  const [select, setSelect] = React.useState("");
  const dispatch = useDispatch();
  const search = useSelector(getSearch);

  const filteredDoctors = useMemo(() => {
    if (speciality === "None") {
      return doctor;
    }
    return doctor?.filter((doc) =>
      doc.speciality.toLowerCase().includes(speciality.toLowerCase())
    );
  }, [doctor, speciality]);

  useEffect(() => {
    // Update the select state when filtered doctors change
    setSelect(filteredDoctors);
  }, [filteredDoctors]);
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        await dispatch(setSearch(""));
        const response = await dispatch(getDoctor()).unwrap();
        setDoctor(response);
        setSelect(response);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 9),
  );
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    console.log("hihi")
  
    // Allow times only up to 9 PM
    const maxTime = setHours(setMinutes(new Date(), 0), 21);
  
    return selectedDate >= currentDate && selectedDate <= maxTime;
  };
  const patientID = useSelector(getpatientID);
  const patientName = useSelector(getName);
  const email = useSelector(getEmail);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const doc = doctor?.find((doc) => {
        return doc.doctorId === data.doctor;
      });
      console.log(doc);

      const appointmentID = await dispatch(
        scheduleAppointment({
          doctorID: data.doctor,
          patientID,
          date,
          address: doc.clinicAddress,
          patientName,
          doctorName: doc.name,
          email,
        })
      ).unwrap();

      dispatch(setDoctorName(doc.name));

      navigate(
        `/patient/${patientID}/appointment/success?appointmentID=${appointmentID}`
      );
    } catch (e) {
      console.log(e);
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
  console.log(speciality)
  return (
    <div className="flex h-screen">
      <section className="container py-10 remove-scrollbar">
        <h1 className="text-left text-3xl font-bold w-full">MedID</h1>
        <div className="sub-container max-w-[860px] flex-1 flex-col gap-9 pb-10">
          <h1 className="text-3xl font-bold">Request a new Appointment</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {/* Doctor Selection */}
              <div className="flex-1 text-gray-400 my-2">
                <Label >
                  Speciality
                </Label>
                <div className="">
                  
                  <Select
                        onValueChange={(e) => {
                          console.log(e);
                          setSpeciality(e);
                        }}
                        className="data-[state=checked]:text-green-400"
                      >
                        <SelectTrigger className="shad-select-trigger my-0 py-0 fontlight border-0 focus:bg-slate-600">
                          {speciality ? speciality : "Select Speciality"}
                        </SelectTrigger>
                        <SelectContent className="shad-select-content fontlight border-0">
                        
                          <SelectItem value="None" className="fontlight shad-select-item ">
                            None
                          </SelectItem>
                          <SelectItem value="Cardiology" className="fontlight shad-select-item ">
                            Cardiology
                          </SelectItem>
                          <SelectItem value="Dermatology" className="fontlight shad-select-item ">
                            Dermatology
                          </SelectItem>

                        </SelectContent>
                        
                      </Select>

                </div>
                <Label htmlFor="Doctor">
                  <span>Doctor</span>
                </Label>
                <Controller
                  name="doctor"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="relative">
                      <Select
                        onValueChange={(e) => {
                          console.log(e);
                          field.onChange(e);
                        }}
                        value={field.value}
                        className="data-[state=checked]:text-green-400"
                      >
                        <SelectTrigger className="shad-select-trigger my-0 py-0 fontlight border-0 focus:bg-slate-600">
                          {field.value
                            ? select.find((doc) => doc.doctorId == field.value)?.name
                            : "Select Doctor"}
                        </SelectTrigger>
                        <SelectContent className="shad-select-content fontlight border-0">
                          {doctor &&
                            select.map((doc) => (
                              <div
                                key={doc.doctorId}
                                className="relative fontlight border-y group border-green-200"
                              >
                                <Accordion type="single" collapsible>
                                  <AccordionItem value={doc.doctorId} className="fontlight border-green-200">
                                    <AccordionTrigger className="fontlight">
                                      <SelectItem value={doc.doctorId} className="fontlight shad-select-item ">
                                        {doc.name}
                                      </SelectItem>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="p-4 text-white fontlight rounded-md shadow-lg ">
                                        <div className="flex items-center gap-4">
                                          <img
                                            src={doc.photo}
                                            alt={`${doc.name}`}
                                            className="w-16 h-16 rounded-full"
                                          />
                                          <div>
                                            <h3 className="text-xl fontlight">{doc.name}</h3>
                                            <p className="text-md text-gray-300">{doc.speciality}</p>
                                          </div>
                                        </div>
                                        <div className="mt-4 text-sm space-y-2">
                                          <p>
                                            <span className="font">Experience:</span> {doc.experience} years
                                          </p>
                                          <p>
                                            <span className="font">Qualification:</span> {doc.qualification}
                                          </p>
                                          <p>
                                            <span className="font">Clinic Address:</span> {doc.clinicAddress}
                                          </p>
                                          <p>
                                            <span className="font">Clinic Phone Number:</span> {doc.phone}
                                          </p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.doctor && (
                        <span className="text-red-500 text-sm">
                          {errors.doctor.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* Appointment Date Selection */}
              <div className="flex-1 text-gray-400 my-2">
                <Label htmlFor="Doctor">
                  <span>Select Appointment Date</span>
                </Label>
                <div className="flex items-center bg-dark-400 rounded-md mt-1 p-[0.6rem] gap-2 shad-select-trigger my-0 py-0 fontlight border-0 focus:bg-slate-600 ">
                  <Calendar className="ml-2" color="#ffffff" />
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
                        minDate={new Date()}
                        className="text-sm"
                        placeholderText="Select Date"
                        dateFormat="MM/dd/yyyy"
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
              {/* Submit Button */}
              <Button
                className={cn("text-white rounded-md p-2 m-2 w-full", {
                  "bg-green-500": type === "create",
                  "bg-red-400": type === "cancel",
                })}
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" /> Loading...
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

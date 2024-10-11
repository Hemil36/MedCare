import { columns } from "@/components/Column";
import { DataTable } from "@/components/Table";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAppointmentbyPatient } from "@/lib/store/AsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { getpatientID } from "@/lib/store/UserSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const UserAppoint = () => {
  const [appointments, setAppointments] = React.useState(null);
  const [noappointment , setNoAppointment] = React.useState(false)
  
  const dispatch = useDispatch();
  const patientID = useSelector(getpatientID);
  const href=`/patient/${patientID}/appointment`
  useEffect(() => {
    const getAppointments = async () => {
      try{
      const response = await dispatch(
        getAppointmentbyPatient({ patientID })
      ).unwrap();
      setNoAppointment(false)
      setAppointments(response);
      console.log(response);
    }catch(err){
      setNoAppointment(true)
      console.log(err)
    }
    };

    getAppointments();
  }, []);

  const sortedAppointments = appointments?.sort(
    (a, b) => new Date(a?.appointment.date) - new Date(b?.appointment?.date)
  );

  // Get the current date and time
  const now = new Date();

  // Find last appointment (the latest one before now)
  const lastAppointment = sortedAppointments
    ?.filter((appt) => new Date(appt?.appointment?.date) < now)
    .pop();
  const lastAppointmentDate = new Date(lastAppointment?.appointment?.date);
  // Find upcoming appointment (the earliest one after now)
  console.log(lastAppointment);
  const upcomingAppointment = sortedAppointments?.find(
    (appt) => new Date(appt?.appointment?.date) > now
  );
  const upcomingAppointmentDate = new Date(
    upcomingAppointment?.appointment?.date
  );
  return (
    <div className="w-full h-full">
      <h1 className=" text-4xl font-bold ">Appointments</h1>
      <Button className="mt-5 bg-green-500"  > <Link to={href}>Schedule Appointment</Link></Button>
{ !noappointment ? appointments ? <>
      <div className=" flex items-center ">
        <div className="pt-6 grow">
          Last Appointment
          <div className="stat-card  bg-pending w-fit mt-4  ">
            <h2 className="text-2xl font-semibold text-white">
              {lastAppointment?.doctorDetails || "No Appointments"}
            </h2>
            <div className=" flex flex-col gap-2 text-[1rem] ">
              <p>Reason : {lastAppointment?.appointment?.reason || "  "}</p>
              <p className=""> Date : {lastAppointmentDate.toDateString()}</p>
              <p>
                Prescription :{" "}
                {lastAppointment?.appointment?.prescription || "  "}
              </p>
              <p>Notes : {lastAppointment?.appointment?.notes || "  "}</p>
            </div>
          </div>
        </div>
        <div className="pt-6 grow">
          Upcoming Appointment
          <div className="stat-card  bg-pending w-fit mt-4  ">
            <h2 className="text-2xl font-semibold text-white">
              {upcomingAppointment?.doctorDetails || "No Appointments"}
            </h2>
            <div className=" flex flex-col gap-2 text-[1rem] ">
              <p>{upcomingAppointment?.appointment?.reason ? `Reason : ${upcomingAppointment?.appointment?.reason}`   : " " || "  "}</p>
              <p className="">
                {" "}
                Date : {upcomingAppointmentDate.toDateString()}
              </p>
              <p>
                
                {upcomingAppointment?.appointment?.prescription ? ` Prescription : ${upcomingAppointment?.appointment?.prescription}` : "  "}
              </p>
              <p> {upcomingAppointment?.appointment?.notes ? `Notes : ${upcomingAppointment?.appointment?.notes}` : "  "}</p>
            </div>
          </div>
        </div>
        <div className="">
          <h1 className=" p-6"> Previous Appointments</h1>

          {appointments ? (
            <>
              <ScrollArea className=" h-[19rem] bg-pending  bg-blend-soft-light  rounded-xl p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Doctor</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments?.map((appointment) => {
                      console.log(appointment)
                      console.log(appointments)
                      const date = new Date(appointment?.appointment?.date);
                      return (
                        <Dialog key={appointment._id}>
                          <DialogTrigger asChild>
                            <TableRow
                              key={appointment._id}
                              className="hover:cursor-pointer"
                            >
                              <TableCell className="font-medium text-nowrap">
                                {appointment?.doctorDetails}
                              </TableCell>
                              <TableCell>{date.toDateString()}</TableCell>
                            </TableRow>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] text-white jakarta border-0 bg-black rounded-full">
                            <DialogHeader>
                              <DialogTitle className="text-center text-2xl">
                                Appointment details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Doctor
                                </Label>
                                <Input
                                  id="name"
                                  value={appointment?.doctorDetails}
                                  className="shad-input col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Date
                                </Label>
                                <Input
                                  id="username"
                                  value={date.toDateString()}
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Type
                                </Label>
                                <Input
                                  id="username"
                                  value={appointment.appointment.status}
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Prescription
                                </Label>
                                <Input
                                  id="username"
                                  value={
                                    appointment.appointment?.prescription ||
                                    " No   Prescription"
                                  }
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Notes
                                </Label>
                                <Input
                                  id="username"
                                  value={
                                    appointment.appointment?.notes ||
                                    " No  Notes"
                                  }
                                  className="col-span-3 shad-input"
                                  
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          ) : (
            <ScrollArea className=" h-[15rem] bg-pending  bg-blend-soft-light  rounded-xl p-4 text-xl font-bold text-center ">
              No Appointments
            </ScrollArea>
          )}
        </div>
      </div>

</> : <>
<div className=" h-full w-full relative">
            <Loader className="animate-spin h-10 w-10 absolute top-1/3 right-1/2" />
          </div>

</> :<p className="pt-5">No Appointments found</p> }

      {/* <DataTable columns={columns}  /> */}
    </div>
  );
};

export default UserAppoint;

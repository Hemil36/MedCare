


import { AppointmentDialog } from "./AppointmentDialog"
import { StatusBadge } from "./Status";
import React from "react";

export const columns = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patientDetails.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment?.appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      const date = new Date(appointment.appointment.date);
      return (
        <p className="text-14-regular min-w-[100px]">
          { appointment.appointment.status !== "pending" &&
          date.toLocaleDateString()+ " | "+
          " " + date.toLocaleTimeString().replace(/:\d+ /, " ")
          }
        </p>
      );
    },
  },
  {
    accessorKey: "MedicalReasons",
    header: "Reason For Appointment",
    cell: ({ row }) => {
      const doctor = row.original.appointment;

      return (
          
          <p className="whitespace-nowrap text-center"> { doctor.notes ? doctor.notes : "Not Mentioned"}</p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row , update }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
        
            <AppointmentDialog
            patientId={appointment?.patientID}
            patientID={appointment?.patientID}
            appointment={appointment.appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />

          

         <AppointmentDialog
            patientId={appointment?.patientID}
            patientID={appointment?.patientID}
            appointment={appointment.appointment}
            update={update}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          
        </div>
      );
    },
  },
];


import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";


import "react-datepicker/dist/react-datepicker.css";
import AppointmentForm from "@/forms/AppointmentForm";

export const AppointmentDialog = ({
  patientId,
  patientID,
  appointment,
  type
}) => {

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}  ${type === "cancel" && "text-red-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md text-white jakarta">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          patientID={patientID}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
import { z } from "zod";

export const ScheduleAppointmentSchema = z.object({
    doctor: z.string().min(2, "Select at least one doctor"),
    schedule: z.coerce.date(),
  });
  
  export const CancelAppointmentSchema = z.object({
    doctor: z.string().min(2, "Select at least one doctor"),
    schedule: z.coerce.date(),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z
      .string()
      .min(2, "Reason must be at least 2 characters")
      .max(500, "Reason must be at most 500 characters"),
  });

  export function getAppointmentSchema(type) {
    switch (type) {
      case "create":
        return ScheduleAppointmentSchema;
      case "cancel":
        return CancelAppointmentSchema;
      default:
        return ScheduleAppointmentSchema;
    }
  }
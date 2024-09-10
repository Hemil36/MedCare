import {z} from "zod";
import { onUpload } from "../fileUploader";

export const DoctorFormValidation = z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .refine((phone) => /^\d{10}$/.test(phone), "Invalid phone number"),
    birthDate:  z.coerce.date(),
    gender: z.enum(["M", "F", "Other"]),
    clinicaddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),
   
    emergencyContactName: z
      .string()
      .min(2, "Contact name must be at least 2 characters")
      .max(50, "Contact name must be at most 50 characters"),
    emergencyPhone: z
      .string()
      .refine(
        (emergencyPhone) => /^\d{10}$/.test(emergencyPhone),
        "Invalid phone number"
      ),
    identificationType: z.string(),
    adhaarNumber: z.string().min(2, "Insurance name must be at least 2 characters"),
    identificationDocument: z.string().min(2, "Upload a valid identification document").refine((str)=> { const byteSize = new TextEncoder().encode(str).length;
    return byteSize <= 1* 1024 * 1024},{
      "message": "File size too large"
    }),
    speciality: z.string().min(4, "Speciality must be at least 2 characters"),
    graduationYear: z.string().max(new Date().getFullYear()),
    degree: z.string().min(4, "Degree must be at least 2 characters"),
    councilID: z.string().min(6, "Council ID must be at og 6 letters"),
    privacyConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: "You must consent to privacy in order to proceed",
      }),
  });
  
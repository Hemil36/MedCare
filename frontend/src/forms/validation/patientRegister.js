import {z} from "zod";
import { onUpload } from "../fileUploader";

export const PatientFormValidation = z.object({
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
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),
    occupation: z
      .string()
      .min(2, "Occupation must be at least 2 characters")
      .max(500, "Occupation must be at most 500 characters"),
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
    insuranceProvider: z
      .string()
      .min(2, "Insurance name must be at least 2 characters")
      .max(50, "Insurance name must be at most 50 characters").optional(),
    insurancePolicyNumber: z
      .string()
      .min(2, "Policy number must be at least 2 characters")
      .max(50, "Policy number must be at most 50 characters").optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string(),
    adhaarNumber: z.string().min(2, "Insurance name must be at least 2 characters"),
    identificationDocument: z.string().min(2, "Upload a valid identification document").refine((str)=> { const byteSize = new TextEncoder().encode(str).length;
    return byteSize <= 1* 1024 * 1024},{
      "message": "File size too large"
    }),
   
    privacyConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: "You must consent to privacy in order to proceed",
      }),
  });
  
import { z } from "zod";

export const profileValidation = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    occupation: z.string().min(2, "Occupation must be at least 2 characters"),
    emergencyContactName: z.string().min(2, "Name must be at least 2 characters"),
    emergencyPhone: z.string().min(10, "Phone number must be at least 10 characters"),
    });

    export const docprofileValidation = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 characters"),
        clinicPhoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
        clinicAddress: z.string().min(5, "Address must be at least 5 characters"),
        
        });
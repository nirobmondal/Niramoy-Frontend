import * as z from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Shipping address must be at least 5 characters"),
  shippingCity: z
    .string()
    .trim()
    .min(2, "Shipping city must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),
  notes: z.string().trim().max(300, "Notes can be at most 300 characters"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

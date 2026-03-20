import * as z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(11, "Phone number is too short").optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
  image: z.string().url("Image URL must be valid").optional().or(z.literal("")),
});

export const becomeSellerSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  storeLogo: z
    .string()
    .url("Store logo URL must be valid")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactNumber: z.string().min(11, "Contact number is too short"),
  openingTime: z.string().min(3, "Opening time is required"),
  closingTime: z.string().min(3, "Closing time is required"),
  offDay: z.string().min(3, "Off day is required"),
});

export const updateSellerSchema = becomeSellerSchema;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BecomeSellerInput = z.infer<typeof becomeSellerSchema>;
export type UpdateSellerInput = z.infer<typeof updateSellerSchema>;

import { object, string } from "yup";
export const contactSchema = object({
  email: string()
    .email("Email must be a valid email address")
    .required("An email address is required"),
  firstName: string(),
  lastName: string(),
  reason: object({ id: string(), name: string() }),
  phone: string()
    .min(10, "Phone number must be 10 digits")
    .required("A phone number is required"),
  message: string().required("A message is required"),
});

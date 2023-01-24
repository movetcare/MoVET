import { object, string } from "yup";
export const contactSchema = object({
  email: string()
    .email("Email must be a valid email address")
    .required("An email address is required"),
  firstName: string(),
  lastName: string(),
  reason: object({ id: string(), name: string() }),
  phone: string(),
  message: string().required("A message is required"),
});

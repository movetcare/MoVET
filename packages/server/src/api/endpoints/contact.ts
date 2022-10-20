import type { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import { sendResponse } from "../sendResponse";

const allowedMethods = ["POST"];
const formSchema = object({
  email: string()
    .email("Email must be a valid email address")
    .required("An email address is required"),
  firstName: string(),
  lastName: string(),
  phone: string()
    .min(10, "Phone number must be 10 digits")
    .required("A phone number is required"),
  message: string().required("A message is required"),
});

export const processContactRequest = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (!allowedMethods.includes(req.method!) || req.method == "OPTIONS")
      return sendResponse({
        statusCode: 405,
        success: false,
        error: "Method not allowed.",
        res,
      });
    return formSchema
      .validate(typeof req.body === "object" ? req.body : JSON.parse(req.body))
      .then(function (value: any) {
        console.log(value);
        return sendResponse({
          statusCode: 200,
          success: true,
          res,
        });
      })
      .catch(function (error: any) {
        console.error(error);
        return sendResponse({
          statusCode: 400,
          success: false,
          error: error?.message || JSON.stringify(error),
          res,
        });
      });
  } catch (error: any) {
    console.error(error);
    return sendResponse({
      statusCode: 500,
      success: false,
      error: error?.message || JSON.stringify(error),
      res,
    });
  }
};

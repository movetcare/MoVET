import type { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import { sendResponse } from "../sendResponse";

const DEBUG = true;
const logSource = "(API) /contact -> processContactRequest()";
const allowedMethods = ["POST"];
const formSchema = object({
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

export const processContactRequest = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (!allowedMethods.includes(req.method!) || req.method == "OPTIONS")
      return sendResponse({
        status: 405,
        error: logSource,
        res,
      });
    return formSchema
      .validate(typeof req.body === "object" ? req.body : JSON.parse(req.body))
      .then(function (value: any) {
        if (DEBUG) console.log(logSource, value);
        // write to firebase
        return sendResponse({
          status: 200,
          res,
        });
      })
      .catch(function (error: any) {
        console.error(logSource, error);
        return sendResponse({
          status: 400,
          error: logSource,
          res,
        });
      });
  } catch (error: any) {
    console.error(logSource, error);
    return sendResponse({
      status: 500,
      error: logSource,
      res,
    });
  }
};

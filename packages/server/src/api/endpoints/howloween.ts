import type { NextApiRequest, NextApiResponse } from "next";
import { saveHowloweenRequest } from "../../queries/saveHowloweenRequest";
import { sendResponse } from "../sendResponse";
import { addMethod, object, string } from "yup";
const DEBUG = false;

const logSource = "(API) /howloween -> processHowloweenRequest()";
const allowedMethods = ["POST"];

addMethod(string as any, "isBeforeToday", function (errorMessage: string) {
  return (this as any).test(
    "test-before-today",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const today = new Date();
      const date = value?.split("-");
      const month = date[0];
      const day = date[1];
      const year = date[2];
      const valueAsDate = new Date(year, month - 1, day);
      return (
        today > valueAsDate || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidDay", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-day",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const day = date[1];
      return (
        (day <= 31 && day >= 1) || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidMonth", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-month",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const month = date[0];
      return (
        (month <= 12 && month >= 1) ||
        createError({ path, message: errorMessage })
      );
    },
  );
});

export const processHowloweenRequest = (
  req: NextApiRequest,
  res: NextApiResponse,
  source: "movetcare.com/howloween/",
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!allowedMethods.includes(req.method!) || req.method == "OPTIONS")
      return sendResponse({
        status: 405,
        error: logSource,
        res,
      });
    const request =
      typeof req.body === "object" ? req.body : JSON.parse(req.body);
    return object({
      email: string()
        .email("Email must be a valid email address")
        .required("An email address is required"),
      firstName: string().required("A First Name is required"),
      lastName: string().required("A last name is required"),
      phone: string().required("A phone number is required"),
      handle: string(),
      petName: string().required("A pet name is required"),
      petAge: (string() as any)
        .isBeforeToday("Birthday must be before today")
        .isValidDay("Please enter valid day")
        .isValidMonth("Please enter a valid month")
        .required("A birthday is required"),
      petBreed: string().required("A breed for your pet is required"),
      petGender: string().required("A gender for your pet is required"),
      petHandle: string(),
      description: string().required("A costume description is required"),
      funFact: string(),
    })
      .validate(request)
      .then(async (value) => {
        if (DEBUG) console.log(logSource, value);
        if (await saveHowloweenRequest({ ...request, source }))
          return sendResponse({
            status: 200,
            res,
          });
        else {
          console.error(logSource, "saveHowloweenRequest() FAILED");
          return sendResponse({
            status: 500,
            error: logSource,
            res,
          });
        }
      })
      .catch((error) => {
        console.error(logSource, error);
        return sendResponse({
          status: 400,
          error: logSource,
          res,
        });
      });
  } catch (error) {
    console.error(logSource, error);
    return sendResponse({
      status: 500,
      error: logSource,
      res,
    });
  }
};

import type { NextApiRequest, NextApiResponse } from "next";
import { saveK9SmilesRequest } from "../../queries/saveK9SmilesRequest";
import { sendResponse } from "../sendResponse";
import { object, string } from "yup";
const DEBUG = false;

const logSource = "(API) /k9-smiles -> processK9SmilesRequest()";
const allowedMethods = ["POST"];
export const processK9SmilesRequest = (
  req: NextApiRequest,
  res: NextApiResponse,
  source: "movetcare.com/k9-smiles/"
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
    })
      .validate(request)
      .then(async (value) => {
        if (DEBUG) console.log(logSource, value);
        if (await saveK9SmilesRequest({ ...request, source }))
          return sendResponse({
            status: 200,
            res,
          });
        else {
          console.error(logSource, "saveK9SmilesRequest() FAILED");
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

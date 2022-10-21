import { contactSchema } from "schemas";
import type { NextApiRequest, NextApiResponse } from "next";
import { setContact } from "../../queries/setContact";
import { sendResponse } from "../sendResponse";

const DEBUG = true;
const logSource = "(API) /contact -> processContactRequest()";
const allowedMethods = ["POST"];
export const processContactRequest = (
  req: NextApiRequest,
  res: NextApiResponse
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
    return contactSchema
      .validate(request)
      .then(async (value) => {
        if (DEBUG) console.log(logSource, value);
        const didSucceed = await setContact(request);
        if (didSucceed)
          return sendResponse({
            status: 200,
            res,
          });
        else {
          console.error(logSource, "setContact() FAILED");
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

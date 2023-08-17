import type { NextApiRequest, NextApiResponse } from "next";
import { setBooking } from "../../queries/setBooking";
import { sendResponse } from "../sendResponse";
import { getAppointmentFromBooking } from "../../queries/getAppointmentFromBooking";
const DEBUG = false;

const logSource =
  "(API) /request-an-appointment -> processAppointmentBookingRequest()";
const allowedMethods = ["POST"];
export const processAppointmentBookingRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
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
    if (DEBUG) console.log(logSource, request);
    const didSucceed = await setBooking({ ...request });
    const payload = await getAppointmentFromBooking(request?.id);
    if (didSucceed)
      return sendResponse({
        status: 200,
        res,
        payload,
      });
    else {
      console.error(logSource, "setBooking() FAILED");
      return sendResponse({
        status: 500,
        error: logSource,
        res,
      });
    }
  } catch (error) {
    console.error(logSource, error);
    return sendResponse({
      status: 500,
      error: logSource,
      res,
    });
  }
};

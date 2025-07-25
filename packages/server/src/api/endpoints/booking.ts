import type { NextApiRequest, NextApiResponse } from "next";
import { setBooking, setClinicBooking } from "../../queries/setBooking";
import { sendResponse } from "../sendResponse";

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
    if (didSucceed)
      return sendResponse({
        status: 200,
        res,
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

const clinicLogSource =
  "(API) /request-an-appointment -> processClinicAppointmentBookingRequest()";
export const processClinicAppointmentBookingRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!allowedMethods.includes(req.method!) || req.method == "OPTIONS")
      return sendResponse({
        status: 405,
        error: clinicLogSource,
        res,
      });
    const request =
      typeof req.body === "object" ? req.body : JSON.parse(req.body);
    if (DEBUG) console.log(clinicLogSource, request);
    const didSucceed = await setClinicBooking({ ...request });
    if (didSucceed)
      return sendResponse({
        status: 200,
        res,
      });
    else {
      console.error(clinicLogSource, "setBooking() FAILED");
      return sendResponse({
        status: 500,
        error: clinicLogSource,
        res,
      });
    }
  } catch (error) {
    console.error(clinicLogSource, error);
    return sendResponse({
      status: 500,
      error: clinicLogSource,
      res,
    });
  }
};

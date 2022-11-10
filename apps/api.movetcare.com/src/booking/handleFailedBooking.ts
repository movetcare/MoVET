import {throwError} from "../config/config";
import type { BookingError } from "../types/booking";
const DEBUG = false;
export const handleFailedBooking = async (
  data: any,
  message: string
): Promise<BookingError> => {
  if (DEBUG) console.log("handleFailedBooking => FAILED BOOKING", message);
  await throwError({
    sendToSlack: true,
    tag: "appointment-booking",
    source: "api",
    success: false,
    ...data,
    message,
  });
  return {
    error: true,
    message,
  };
};

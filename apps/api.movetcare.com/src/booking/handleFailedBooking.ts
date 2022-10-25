import {throwError} from "../config/config";
const DEBUG = true;
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

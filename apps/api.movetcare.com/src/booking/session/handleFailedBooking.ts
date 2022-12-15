import { throwError, DEBUG } from "../../config/config";
import type { BookingError } from "../../types/booking";

export const handleFailedBooking = async (
  data: any,
  message: string
): Promise<BookingError> => {
  if (DEBUG) console.log("handleFailedBooking => FAILED BOOKING", message);
  throwError({
    ...data,
    message,
  });
  return {
    error: true,
    message,
  };
};

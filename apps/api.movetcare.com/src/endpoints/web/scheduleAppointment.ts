import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, BookingResponse } from "../../types/booking";
import { processContactInfo } from "../../booking/session/processContactInfo";
import { setupNewBookingSession } from "../../booking/session/setupNewBookingSession";
import { processAddAPet } from "../../booking/session/processAddAPet";
const DEBUG = true;

export const scheduleAppointment = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<BookingResponse | BookingError> => {
    if (DEBUG)
      console.log(
        "scheduleAppointment => INCOMING REQUEST PAYLOAD scheduleAppointment => ",
        data
      );
    const { token, email, contactInfo, id, addAPet } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email) return await setupNewBookingSession(data);
        else if (contactInfo && id) {
          if (DEBUG) console.log("CONTACT INFO DATA", data);
          if (
            contactInfo?.firstName &&
            contactInfo?.lastName &&
            contactInfo?.phone &&
            contactInfo?.uid &&
            contactInfo?.requiresInfo
          )
            return await processContactInfo(id, contactInfo);
          else
            return await handleFailedBooking(
              data,
              "FAILED TO HANDLE CONTACT INFO"
            );
        } else if (addAPet && id) {
          if (DEBUG) console.log("ADD A PET DATA", data);
          if (
            addAPet?.name &&
            addAPet?.type &&
            addAPet?.gender &&
            addAPet?.spayedOrNeutered &&
            addAPet?.aggressionStatus &&
            addAPet?.breed &&
            addAPet?.birthday &&
            addAPet?.weight
          )
            return await processAddAPet(id, addAPet);
          else
            return await handleFailedBooking(
              data,
              "FAILED TO HANDLE ADD A PET"
            );
        } else
          return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

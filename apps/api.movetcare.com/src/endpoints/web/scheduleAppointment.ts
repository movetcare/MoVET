import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, BookingResponse } from "../../types/booking";
import { processContactInfo } from "../../booking/session/processContactInfo";
import { setupNewBookingSession } from "../../booking/session/setupNewBookingSession";
import { processAddAPet } from "../../booking/session/processAddAPet";
import { processPetSelection } from "../../booking/session/processPetSelection";
const DEBUG = true;

export const scheduleAppointment = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<BookingResponse | BookingError> => {
    if (DEBUG)
      console.log(
        "scheduleAppointment => INCOMING REQUEST PAYLOAD scheduleAppointment => ",
        data
      );
    const {
      token,
      email,
      contactInfo,
      id,
      addAPet,
      petSelection,
      establishCareExamRequired,
    } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email) return await setupNewBookingSession(data);
        else if (contactInfo && id) {
          if (DEBUG) console.log("CONTACT INFO DATA", contactInfo);
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
          if (DEBUG) console.log("ADD A PET DATA", addAPet);
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
        } else if (petSelection && id) {
          if (DEBUG) console.log("PET SELECTION DATA", petSelection);
          if (petSelection?.pets?.length > 0)
            return await processPetSelection(
              id,
              petSelection.pets,
              establishCareExamRequired
            );
          else
            return await handleFailedBooking(
              data,
              "FAILED TO HANDLE PET SELECTION"
            );
        } else
          return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, BookingResponse } from "../../types/booking";
import { processContactInfo } from "../../booking/session/processContactInfo";
import { setupNewBookingSession } from "../../booking/session/setupNewBookingSession";
import { processAddAPet } from "../../booking/session/processAddAPet";
import { processPetSelection } from "../../booking/session/processPetSelection";
import { processIllPetSelection } from "../../booking/session/processIllPetSelection";
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
      illPetSelection,
    } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email) return await setupNewBookingSession(data);
        else if (id) {
          if (contactInfo) return await processContactInfo(id, contactInfo);
          else if (addAPet) return await processAddAPet(id, addAPet);
          else if (petSelection)
            return await processPetSelection(
              id,
              Array.isArray(petSelection.pets)
                ? petSelection.pets
                : [petSelection.pets],
              establishCareExamRequired
            );
          else if (illPetSelection)
            return await processIllPetSelection(
              id,
              Array.isArray(illPetSelection?.illPets)
                ? illPetSelection?.illPets
                : [illPetSelection?.illPets]
            );
          else
            return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
        }
        return await handleFailedBooking(data, "FAILED TO GET SESSION");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

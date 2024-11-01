import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, ClinicBooking } from "../../types/booking";
import { setupNewClinicBookingSession } from "../../booking/clinic/session/setupNewClinicBookingSession";
import { processClinicContactInfo } from "../../booking/clinic/session/processClinicContactInfo";
import { processClinicAddAPet } from "../../booking/clinic/session/processClinicAddAPet";
import { processClinicPetSelection } from "../../booking/clinic/session/processClinicPetSelection";
import { processClinicDateTime } from "../../booking/clinic/session/processClinicDateTime";
const DEBUG = false;
export const scheduleClinic = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<ClinicBooking | BookingError> => {
    if (DEBUG)
      console.log(
        "scheduleClinic => INCOMING REQUEST PAYLOAD scheduleClinic => ",
        data,
      );
    const {
      token,
      email,
      clinic,
      id,
      contactInfo,
      addAPet,
      petSelection,
      requestedDateTime,
    } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email && clinic) {
          if (DEBUG)
            console.log(
              "scheduleClinic => setupNewClinicBookingSession => ",
              data,
            );
          return await setupNewClinicBookingSession(data);
        } else if (id) {
          if (contactInfo) {
            if (DEBUG)
              console.log(
                "scheduleClinic => processContactInfo => ",
                contactInfo,
              );
            return await processClinicContactInfo(id, contactInfo);
          } else if (addAPet) {
            if (DEBUG)
              console.log("scheduleClinic => processAddAPet => ", addAPet);
            return await processClinicAddAPet(id, addAPet);
          } else if (petSelection) {
            if (DEBUG)
              console.log(
                "scheduleClinic => processPetSelection => ",
                petSelection,
              );
            return await processClinicPetSelection(
              id,
              Array.isArray(petSelection.pets)
                ? petSelection.pets
                : [petSelection.pets],
            );
          } else if (requestedDateTime) {
            if (DEBUG)
              console.log(
                "scheduleClinic => processDateTime => ",
                requestedDateTime,
              );
            return await processClinicDateTime(id, requestedDateTime);
          } else
            return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
        }
        return await handleFailedBooking(data, "FAILED TO GET SESSION");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

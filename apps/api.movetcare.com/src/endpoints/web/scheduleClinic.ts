import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, ClinicBooking } from "../../types/booking";
import { setupNewClinicBookingSession } from "../../booking/clinic/session/setupNewClinicBookingSession";
import { processClinicContactInfo } from "../../booking/clinic/session/processClinicContactInfo";
//import { processContactInfo } from "../../booking/session/processContactInfo";
// import { processAddAPet } from "../../booking/session/processAddAPet";
// import { processPetSelection } from "../../booking/session/processPetSelection";
// import { processDateTime } from "../../booking/session/processDateTime";
const DEBUG = true;
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
      clinicId,
      id,
      contactInfo,
      //   addAPet,
      //   petSelection,
      //   establishCareExamRequired,
      //   requestedDateTime,
    } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email && clinicId) {
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
          }
          //   else if (addAPet) {
          //     if (DEBUG)
          //       console.log("scheduleClinic => processAddAPet => ", addAPet);
          //     return await processAddAPet(id, addAPet);
          //   } else if (petSelection) {
          //     if (DEBUG)
          //       console.log(
          //         "scheduleClinic => processPetSelection => ",
          //         petSelection,
          //       );
          //     return await processPetSelection(
          //       id,
          //       Array.isArray(petSelection.pets)
          //         ? petSelection.pets
          //         : [petSelection.pets],
          //       establishCareExamRequired,
          //     );
          //   } else if (requestedDateTime) {
          //     if (DEBUG)
          //       console.log(
          //         "scheduleClinic => processDateTime => ",
          //         requestedDateTime,
          //       );
          //     return await processDateTime(id, requestedDateTime);
          //   } else
          //     return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
        }
        return await handleFailedBooking(data, "FAILED TO GET SESSION");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

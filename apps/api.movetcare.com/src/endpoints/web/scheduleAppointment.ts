import { functions, defaultRuntimeOptions } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import type { BookingError, Booking } from "../../types/booking";
import { processContactInfo } from "../../booking/session/processContactInfo";
import { setupNewBookingSession } from "../../booking/session/setupNewBookingSession";
import { processAddAPet } from "../../booking/session/processAddAPet";
import { processPetSelection } from "../../booking/session/processPetSelection";
import { processIllPetSelection } from "../../booking/session/processIllPetSelection";
import { processIllnessDetails } from "../../booking/session/processIllnessDetails";
import { processLocation } from "../../booking/session/processLocation";
import { processDateTime } from "../../booking/session/processDateTime";
import { processReason } from "../../booking/session/processReason";
import { processStaff } from "../../booking/session/processStaff";
const DEBUG = false;
export const scheduleAppointment = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any): Promise<Booking | BookingError> => {
    if (DEBUG)
      console.log(
        "scheduleAppointment => INCOMING REQUEST PAYLOAD scheduleAppointment => ",
        data,
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
      illnessDetails,
      location,
      reason,
      selectedStaff,
      requestedDateTime,
    } = data || {};
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (email) {
          if (DEBUG)
            console.log(
              "scheduleAppointment => setupNewBookingSession => ",
              data,
            );
          return await setupNewBookingSession(data);
        } else if (id) {
          if (contactInfo) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processContactInfo => ",
                contactInfo,
              );
            return await processContactInfo(id, contactInfo);
          } else if (addAPet) {
            if (DEBUG)
              console.log("scheduleAppointment => processAddAPet => ", addAPet);
            return await processAddAPet(id, addAPet);
          } else if (petSelection) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processPetSelection => ",
                petSelection,
              );
            return await processPetSelection(
              id,
              Array.isArray(petSelection.pets)
                ? petSelection.pets
                : [petSelection.pets],
              establishCareExamRequired,
            );
          } else if (illPetSelection) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processIllPetSelection => ",
                illPetSelection,
              );
            return await processIllPetSelection(
              id,
              Array.isArray(illPetSelection?.illPets)
                ? illPetSelection?.illPets
                : [illPetSelection?.illPets],
            );
          } else if (illnessDetails) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processIllnessDetails => ",
                illnessDetails,
              );
            return await processIllnessDetails(id, illnessDetails);
          } else if (location) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processLocation => ",
                location,
              );
            return await processLocation(data);
          } else if (reason) {
            if (DEBUG)
              console.log("scheduleAppointment => processReason => ", reason);
            return await processReason(id, reason);
          } else if (selectedStaff) {
            if (DEBUG)
              console.log("scheduleAppointment => processStaff => ", reason);
            return await processStaff(id, selectedStaff);
          } else if (requestedDateTime) {
            if (DEBUG)
              console.log(
                "scheduleAppointment => processDateTime => ",
                requestedDateTime,
              );
            return await processDateTime(id, requestedDateTime);
          } else
            return await handleFailedBooking(data, "FAILED TO HANDLE REQUEST");
        }
        return await handleFailedBooking(data, "FAILED TO GET SESSION");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

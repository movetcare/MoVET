import {addNewPatient} from "../booking/addNewPatient";
import {removeBookingAbandonmentNotifications} from "../booking/abandonment/removeBookingAbandonmentNotifications";
import {restartBooking} from "../booking/restartBooking";
import {updateBookingClient} from "../booking/updateBookingClient";
import {updateBookingPatients} from "../booking/updateBookingPatients";
import {updateBookingPatientsWithIllness} from "../booking/updateBookingPatientsWithIllness";
import {updateBookingPatientsWithSymptoms} from "../booking/updateBookingPatientsWithSymptoms";
import { functions, DEBUG } from "./../config/config";
import { updateBookingLocation } from "../booking/updateBookingLocation";
import { updateBookingReason } from "../booking/updateBookingReason";
import { updateBookingStaff } from "../booking/updateBookingStaff";
import { updateBookingRequestedDateTime } from "../booking/updateBookingRequestedDateTime";
import { archiveBooking } from "../booking/archiveBooking";

export const handleBookingUpdate = functions.firestore
  .document("bookings/{id}")
  .onWrite((change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    const {
      client,
      step,
      patients,
      newPatient,
      vcprRequired,
      isActive,
      illPatients,
      illnessDetails,
      location,
      reason,
      selectedStaff,
      requestedDateTime,
    } = data || {};
    if (DEBUG) console.log("handleBookingUpdate => DATA", { id, data });
    if (data !== undefined && isActive) {
      if (
        step === "restart" ||
        step === "complete" ||
        step === "cancelled-client"
      ) {
        if (DEBUG)
          console.log(
            `REMOVING BOOKING ABANDONMENT AUTOMATION TASK FROM QUEUE FOR ${id}`
          );
        removeBookingAbandonmentNotifications(id);
      }
      if (
        step === "started" &&
        client.uid &&
        client.email &&
        client.firstName &&
        client.lastName &&
        client.phone
      )
        updateBookingClient(id, client);
      else if (
        (step === "started" || step === "patient-selection") &&
        patients &&
        vcprRequired !== undefined
      )
        updateBookingPatients(id, patients, vcprRequired);
      else if (step === "add-pet" && newPatient && client.uid)
        addNewPatient(id, client.uid, newPatient);
      else if (step === "wellness-check" && illPatients && patients)
        updateBookingPatientsWithIllness(id, patients, illPatients);
      else if (step === "illness-assignment" && illnessDetails)
        updateBookingPatientsWithSymptoms(id, patients, illnessDetails);
      else if (step === "choose-location" && location)
        updateBookingLocation(id, location, vcprRequired, illPatients);
      else if (step === "choose-reason" && reason)
        updateBookingReason(id, reason);
      else if (step === "choose-staff" && selectedStaff)
        updateBookingStaff(id, selectedStaff);
      else if (step === "choose-datetime" && requestedDateTime)
        updateBookingRequestedDateTime(id, client.uid, requestedDateTime);
      else if (step === "complete" && isActive) archiveBooking(id);
      else if (step === "restart") restartBooking(id);
    } else {
      if (DEBUG)
        console.log(
          `CAN NOT UPDATE AN ARCHIVED (OR DELETED) BOOKING: ${id}`,
          data
        );
      removeBookingAbandonmentNotifications(id);
    }
    return true;
  });

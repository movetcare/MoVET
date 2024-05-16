import { handleFailedBooking } from "../../session/handleFailedBooking";
import { admin, DEBUG, throwError } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import type { BookingError, ClinicBooking } from "../../../types/booking";

export const processClinicPetSelection = async (
  id: ClinicBooking["id"],
  selectedPets: ClinicBooking["selectedPatients"],
): Promise<ClinicBooking | BookingError> => {
  const data = {
    id,
    selectedPets,
  };
  if (DEBUG) console.log("PET SELECTION DATA", data);
  if (selectedPets && selectedPets?.length > 0) {
    const bookingRef = admin.firestore().collection("clinic_bookings").doc(id);
    await bookingRef
      .set(
        {
          selectedPatients: selectedPets,
          step: "pet-selection" as ClinicBooking["step"],
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE PET SELECTION FAILED");
      });
    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });
    sendNotification({
      type: "slack",
      payload: {
        message: [
          {
            type: "section",
            text: {
              text: `:book: Clinic Booking_ *UPDATED* (${id})`,
              type: "mrkdwn",
            },
            fields: [
              {
                type: "mrkdwn",
                text: "*STEP*",
              },
              {
                type: "plain_text",
                text: "PET SELECTION",
              },
              {
                type: "mrkdwn",
                text: "*SELECTED PET IDs*",
              },
              {
                type: "plain_text",
                text: JSON.stringify(session.selectedPatients),
              },
              {
                type: "mrkdwn",
                text: "*VCPR Required*",
              },
            ],
          },
        ],
      },
    });
    return {
      patients: session.patients,
      selectedPatients: session.selectedPatients,
      step: "pet-selection",
      requestedDateTime: null,
      id,
      vcprRequired: session?.vcprRequired,
      clinic: session?.clinic,
      client: {
        uid: session?.client?.uid,
        requiresInfo: session?.client?.requiresInfo,
      },
    };
  } else
    return await handleFailedBooking(data, "FAILED TO HANDLE PET SELECTION");
};

import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, BookingResponse } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";

export const processPetSelection = async (
  id: string,
  selectedPets: Array<string>,
  establishCareExamRequired: boolean
): Promise<BookingResponse | BookingError> => {
  const bookingRef = admin.firestore().collection("bookings").doc(id);
  await bookingRef
    .set(
      {
        selectedPatients: selectedPets,
        establishCareExamRequired,
        updatedOn: new Date(),
      },
      { merge: true }
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
            text: `:book: _Appointment Booking_ *UPDATED* (${id})`,
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
            {
              type: "plain_text",
              text: establishCareExamRequired ? "Yes" : "No",
            },
          ],
        },
      ],
    },
  });
  return {
    patients: session.patients,
    selectedPatients: session.selectedPatients,
    establishCareExamRequired: session.establishCareExamRequired,
    id,
    client: {
      uid: session?.client?.uid,
      requiresInfo: session?.client?.requiresInfo,
    },
  };
};

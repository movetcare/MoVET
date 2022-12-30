import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, BookingResponse } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";
const DEBUG = true;
export const processIllPetSelection = async (
  id: string,
  illPets: Array<string>
): Promise<BookingResponse | BookingError> => {
  const data = { id, illPets };
  if (DEBUG) console.log("ILL PETS DATA", data);
  if (illPets?.length > 0) {
    const bookingRef = admin.firestore().collection("bookings").doc(id);
    await bookingRef
      .set(
        {
          illPatientSelection: illPets,
          nextPatient: illPets[0],
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(
          error,
          "UPDATE ILL PET SELECTION FAILED"
        );
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
                text: "ILL PET SELECTION",
              },
              {
                type: "mrkdwn",
                text: "*SELECTED PET IDs*",
              },
              {
                type: "plain_text",
                text: JSON.stringify(session.illPatientSelection),
              },
            ],
          },
        ],
      },
    });
    return {
      ...session,
      id,
      client: {
        uid: session?.client?.uid,
        requiresInfo: session?.client?.requiresInfo,
      },
    };
  } else
    return await handleFailedBooking(data, "FAILED TO HANDLE PET SELECTION");
};

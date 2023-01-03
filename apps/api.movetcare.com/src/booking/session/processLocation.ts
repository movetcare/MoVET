import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";
const DEBUG = false;
export const processLocation = async (data: {
  location: "Clinic" | "Home" | "Virtually";
  locationId: number;
  id: string;
  address?: {
    full: string;
    parts: Array<string>;
    placeId: number;
    info?: string;
    zipcode: number;
  };
}): Promise<Booking | BookingError> => {
  const { location, locationId, address, id } = data;
  if (DEBUG) console.log("LOCATION DATA", data);
  if (location && locationId && id) {
    const bookingRef = admin.firestore().collection("bookings").doc(id);
    await bookingRef
      .set(
        {
          location,
          locationId,
          address,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE LOCATION FAILED");
      });

    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });
    if (session) {
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
                  text: "LOCATION",
                },
                {
                  type: "mrkdwn",
                  text: "*LOCATION*",
                },
                {
                  type: "plain_text",
                  text: session?.location,
                },
                {
                  type: "mrkdwn",
                  text: "*LOCATION ID*",
                },
                {
                  type: "plain_text",
                  text: `${session?.locationId}`,
                },
                {
                  type: "mrkdwn",
                  text: "*ADDRESS*",
                },
                {
                  type: "plain_text",
                  text: session?.address
                    ? JSON.stringify(session?.address)
                    : "N/A",
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
    } else return await handleFailedBooking(data, "FAILED TO GET SESSION");
  } else return await handleFailedBooking(data, "FAILED TO HANDLE LOCATION");
};

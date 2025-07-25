import { DEBUG, admin, throwError } from "../../config/config";
import { updateProVetClient } from "../../integrations/provet/entities/client/updateProVetClient";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";

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
          step: "location-selection" as Booking["step"],
          updatedOn: new Date(),
        },
        { merge: true },
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
    const defaultBookingReasons = await admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET DEFAULT REASONS FAILED");
      });
    if (DEBUG) {
      console.log("session", session);
      console.log("defaultBookingReasons", defaultBookingReasons);
    }
    if (session && defaultBookingReasons) {
      let didUpdateProVetClient = false;
      if (address?.full && location === "Home") {
        const clientAddress: {
          street?: string;
          city?: string;
          zip?: string;
        } = {};

        const providedAddress: Array<string> = address?.full
          ?.split(",")
          .slice(0, 4);
        if (DEBUG) console.log("providedAddress", providedAddress);
        clientAddress.street = providedAddress[0].trim();
        clientAddress.city = providedAddress[1].trim();
        clientAddress.zip = `${address?.zipcode}`;
        if (DEBUG) console.log("clientAddress", clientAddress);
        didUpdateProVetClient = await updateProVetClient({
          ...clientAddress,
          id: session.client.uid,
        });
        if (DEBUG) console.log("didUpdateProVetClient", didUpdateProVetClient);
      } else if (DEBUG)
        console.log(
          "SKIPPED PROVET CLIENT ADDRESS UPDATE - LOCATION: ",
          location,
        );
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
                    ? `${session?.address?.full} (${
                        didUpdateProVetClient
                          ? "Address Updated in ProVet"
                          : "Address NOT Updated in ProVet"
                      })`
                    : "N/A",
                },
              ],
            },
          ],
        },
      });
      return {
        ...session,
        reason: session?.reestablishCareExamRequired
          ? location === "Home"
            ? defaultBookingReasons?.housecallRenewVcprReason
            : location === "Clinic"
              ? defaultBookingReasons?.clinicRenewVcprReason
              : defaultBookingReasons?.virtualRenewVcprReason
          : session?.establishCareExamRequired
            ? location === "Home"
              ? defaultBookingReasons?.housecallStandardVcprReason
              : location === "Clinic"
                ? defaultBookingReasons?.clinicStandardVcprReason
                : defaultBookingReasons?.virtualStandardVcprReason
            : null,
        id,
        client: {
          uid: session?.client?.uid,
          requiresInfo: session?.client?.requiresInfo,
        },
      };
    } else return await handleFailedBooking(data, "FAILED TO GET SESSION");
  } else return await handleFailedBooking(data, "FAILED TO HANDLE LOCATION");
};

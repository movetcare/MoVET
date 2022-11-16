import {UserRecord} from "firebase-admin/lib/auth/user-record";
import { admin, throwError, DEBUG } from "../../config/config";
import type { Booking } from "../../types/booking";
import { startNewBooking } from "../startNewBooking";
import { enforceOnlyOneActiveAppointmentBooking } from "./enforceOnlyOneActiveAppointmentBooking";

export const getActiveBookingSession = async (
  user: UserRecord
): Promise<Booking | false> =>
  await admin
    .firestore()
    .collection("bookings")
    .where("client.uid", "==", `${user?.uid}`)
    .orderBy("createdAt", "desc")
    .get()
    .then(
      async (snapshot: any) => await getActiveAppointmentBooking(user, snapshot)
    )
    .catch((error: any) => throwError(error));

const getActiveAppointmentBooking = async (user: UserRecord, snapshot: any) => {
  const activeBookings: Array<any> = [];
  snapshot.forEach((doc: any) => {
    if (DEBUG)
      console.log("getActiveAppointmentBooking => BOOKING FOUND: ", doc.data());
    if (doc.data()?.isActive) activeBookings.push(doc.id);
  });
  if (activeBookings.length > 0) {
    if (DEBUG)
      console.log(
        "getActiveAppointmentBooking => activeBookings",
        activeBookings
      );
    if (activeBookings) {
      if (activeBookings.length > 1)
        await enforceOnlyOneActiveAppointmentBooking(activeBookings);
      const bookingDocument = await admin
        .firestore()
        .collection("bookings")
        .doc(`${activeBookings[0]}`);
      return {
        ...(await admin
          .firestore()
          .collection("bookings")
          .doc(`${activeBookings[0]}`)
          .get()
          .then(async (document: any) => {
            if (document.exists) {
              if (DEBUG)
                console.log(
                  "getActiveAppointmentBooking => BOOKING DOCUMENT",
                  document.data()
                );
              return { id: bookingDocument?.id, ...document.data() };
            } else
              return {
                id: (await startNewBooking(user))?.id,
              };
          })
          .catch(async (error: any) => throwError(error))),
      };
    } else
      return {
        id: (await startNewBooking(user))?.id,
      };
  } else
    return {
      id: (await startNewBooking(user))?.id,
    };
};

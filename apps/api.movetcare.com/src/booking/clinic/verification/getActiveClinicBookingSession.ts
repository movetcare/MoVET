import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, throwError, DEBUG } from "../../../config/config";
import type { ClinicBooking } from "../../../types/booking";
import { startNewClinicBooking } from "../session/startNewClinicBooking";
import { enforceOnlyOneActiveClinicBooking } from "./enforceOnlyOneActiveClinicBooking";

export const getActiveClinicBookingSession = async (
  clinic: ClinicBooking["clinic"],
  user: UserRecord,
  device: string,
): Promise<ClinicBooking | false> =>
  await admin
    .firestore()
    .collection("clinic_bookings")
    .where("client.uid", "==", `${user?.uid}`)
    .orderBy("createdAt", "desc")
    .get()
    .then(
      async (snapshot: any) =>
        await getActiveClinicBooking(clinic, user, snapshot, device),
    )
    .catch((error: any) => throwError(error));

const getActiveClinicBooking = async (
  clinic: ClinicBooking["clinic"],
  user: UserRecord,
  snapshot: any,
  device: string,
) => {
  const activeBookings: Array<any> = [];
  snapshot.forEach((doc: any) => {
    if (DEBUG)
      console.log("getActiveClinicBooking => BOOKING FOUND: ", doc.data());
    if (doc.data()?.isActive) activeBookings.push(doc.id);
  });
  if (activeBookings.length > 0) {
    if (DEBUG)
      console.log("getActiveClinicBooking => activeBookings", activeBookings);
    if (activeBookings) {
      if (activeBookings.length > 1)
        enforceOnlyOneActiveClinicBooking(activeBookings);
      const bookingDocument = await admin
        .firestore()
        .collection("clinic_bookings")
        .doc(`${activeBookings[0]}`);
      if (DEBUG) console.log("getActiveClinicBooking => CLINIC", clinic);
      await bookingDocument
        .set({ clinic }, { merge: true })
        .catch((error: any) => throwError(error));
      return {
        ...(await bookingDocument
          .get()
          .then(async (document: any) => {
            if (document.exists) {
              if (DEBUG)
                console.log(
                  "getActiveClinicBooking => BOOKING DOCUMENT",
                  document.data(),
                );
              return { id: bookingDocument?.id, ...document.data(), clinic };
            } else
              return {
                id: (await startNewClinicBooking(clinic, user, device))?.id,
              };
          })
          .catch((error: any) => throwError(error))),
      };
    } else
      return {
        id: (await startNewClinicBooking(clinic, user, device))?.id,
      };
  } else
    return {
      id: (await startNewClinicBooking(clinic, user, device))?.id,
    };
};

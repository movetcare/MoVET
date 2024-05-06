import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, throwError, DEBUG } from "../../../config/config";
import type { ClinicBooking } from "../../../types/booking";
import { enforceOnlyOneActiveAppointmentBooking } from "../../verification/enforceOnlyOneActiveAppointmentBooking";
import { startNewClinicBooking } from "../session/startNewClinicBooking";

export const getActiveClinicBookingSession = async (
  clinicId: string,
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
        await getActiveClinicBooking(clinicId, user, snapshot, device),
    )
    .catch((error: any) => throwError(error));

const getActiveClinicBooking = async (
  clinicId: string,
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
        enforceOnlyOneActiveAppointmentBooking(activeBookings);
      const bookingDocument = await admin
        .firestore()
        .collection("clinic_bookings")
        .doc(`${activeBookings[0]}`);
      return {
        ...(await admin
          .firestore()
          .collection("clinic_bookings")
          .doc(`${activeBookings[0]}`)
          .get()
          .then(async (document: any) => {
            if (document.exists) {
              if (DEBUG)
                console.log(
                  "getActiveClinicBooking => BOOKING DOCUMENT",
                  document.data(),
                );
              return { id: bookingDocument?.id, ...document.data() };
            } else
              return {
                id: (await startNewClinicBooking(clinicId, user, device))?.id,
              };
          })
          .catch((error: any) => throwError(error))),
      };
    } else
      return {
        id: (await startNewClinicBooking(clinicId, user, device))?.id,
      };
  } else
    return {
      id: (await startNewClinicBooking(clinicId, user, device))?.id,
    };
};

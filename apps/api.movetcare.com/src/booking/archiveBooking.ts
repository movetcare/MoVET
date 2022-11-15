import { sendBookingRequestAdminNotification } from "./../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin } from "../config/config";

const DEBUG = false;

export const archiveBooking = (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  const bookingRef = admin.firestore().collection("bookings").doc(id);
  bookingRef
    .set(
      {
        step: "needs-scheduling",
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .catch((error: any) => throwError(error));
  sendBookingRequestAdminNotification({ id, bookingRef });
};

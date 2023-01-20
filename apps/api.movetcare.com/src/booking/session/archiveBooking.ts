import { sendBookingRequestAdminNotification } from "../../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin, DEBUG } from "../../config/config";
import { sendBookingRequestClientNotification } from "../../notifications/templates/sendBookingRequestClientNotification";

export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  const bookingRef = admin.firestore().collection("bookings").doc(id);
  await bookingRef
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
  sendBookingRequestClientNotification({ id, bookingRef });
};

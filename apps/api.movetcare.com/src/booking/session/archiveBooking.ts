import { sendBookingRequestAdminNotification } from "../../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin } from "../../config/config";
import { sendBookingRequestClientNotification } from "../../notifications/templates/sendBookingRequestClientNotification";
const DEBUG = true;
export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  const bookingRef = admin.firestore().collection("bookings").doc(id);
  await sendBookingRequestAdminNotification({ id, bookingRef });
  await sendBookingRequestClientNotification({ id, bookingRef });
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
};

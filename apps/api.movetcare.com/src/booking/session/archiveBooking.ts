import { sendBookingRequestAdminNotification } from "../../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin } from "../../config/config";
import { sendBookingRequestClientNotification } from "../../notifications/templates/sendBookingRequestClientNotification";
const DEBUG = true;
export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  await sendBookingRequestAdminNotification({ id });
  await sendBookingRequestClientNotification({ id });
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
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

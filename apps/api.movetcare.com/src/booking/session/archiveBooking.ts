//import { sendBookingRequestAdminNotification } from "../../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin, DEBUG } from "../../config/config";
//import { sendBookingRequestClientNotification } from "../../notifications/templates/sendBookingRequestClientNotification";

export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  // await sendBookingRequestAdminNotification({ id });
  // await sendBookingRequestClientNotification({ id });
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        step: "complete",
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .catch((error: any) => throwError(error));
};

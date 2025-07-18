import { removeBookingAbandonmentNotifications } from "../booking/abandonment/removeBookingAbandonmentNotifications";
import { cancelBooking } from "../booking/abandonment/cancelBooking";
import { functions } from "./../config/config";
import { archiveBooking } from "../booking/session/archiveBooking";
import type { Booking } from "../types/booking";
import { updateBookingCancellation } from "../booking/abandonment/updateBookingCancellation";
const DEBUG = false;
export const handleBookingUpdate = functions.firestore
  .document("bookings/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data: Booking = change.after.data();
    if (DEBUG) console.log("handleBookingUpdate => DATA", { id, data });
    if (data !== undefined) {
      const { step, isActive, cancelReason } = data || {};
      if (cancelReason) await updateBookingCancellation(id, data);
      if (isActive) {
        if (
          step === "restart" ||
          step === "success" ||
          step === "cancelled-client"
        ) {
          if (DEBUG)
            console.log(
              `REMOVING BOOKING ABANDONMENT AUTOMATION TASK FROM QUEUE FOR ${id}`,
            );
          await removeBookingAbandonmentNotifications(id);
        }
        if (step === "success") await archiveBooking(id);
        else if (step === "restart" || step === "cancelled-client")
          await cancelBooking(id, data);
      } else if (DEBUG)
        console.log(
          `CAN NOT UPDATE AN ARCHIVED (OR DELETED) BOOKING: ${id}`,
          data,
        );
    }
    return true;
  });

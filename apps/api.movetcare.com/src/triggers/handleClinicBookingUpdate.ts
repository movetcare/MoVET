import { functions } from "../config/config";
import type { ClinicBooking } from "../types/booking";
import { cancelClinicBooking } from "../booking/clinic/abandonment/cancelClinicBooking";
import { archiveClinicBooking } from "../booking/clinic/session/archiveClinicBooking";
//import { updateClinicBookingCancellation } from "../booking/clinic/abandonment/updateClinicBookingCancellation";
const DEBUG = false;
export const handleClinicBookingUpdate = functions.firestore
  .document("clinic_bookings/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data: ClinicBooking = change.after.data();
    if (DEBUG) console.log("handleClinicBookingUpdate => DATA", { id, data });
    if (data !== undefined) {
      const { step, isActive } = data || {};
      // if (cancelReason) await updateClinicBookingCancellation(id, data);
      if (isActive) {
        if (
          step === "restart" ||
          step === "success" ||
          step === "cancelled-client"
        ) {
          // if (DEBUG)
          //   console.log(
          //     `REMOVING CLINIC BOOKING ABANDONMENT AUTOMATION TASK FROM QUEUE FOR ${id}`,
          //   );
          // await removeClinicBookingAbandonmentNotifications(id);
        }
        if (step === "success") await archiveClinicBooking(id);
        else if (step === "restart" || step === "cancelled-client")
          await cancelClinicBooking(id, data);
      } else if (DEBUG)
        console.log(
          `CAN NOT UPDATE AN ARCHIVED (OR DELETED) CLINIC BOOKING: ${id}`,
          data,
        );
    }
    return true;
  });

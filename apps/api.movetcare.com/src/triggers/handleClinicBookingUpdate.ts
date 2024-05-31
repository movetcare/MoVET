import { admin, functions, throwError } from "../config/config";
import type { ClinicBooking } from "../types/booking";
import { cancelClinicBooking } from "../booking/clinic/abandonment/cancelClinicBooking";
import { archiveClinicBooking } from "../booking/clinic/session/archiveClinicBooking";

const DEBUG = false;
export const handleClinicBookingUpdate = functions.firestore
  .document("clinic_bookings/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data: ClinicBooking = change.after.data();
    if (DEBUG) console.log("handleClinicBookingUpdate => DATA", { id, data });
    if (data !== undefined) {
      const { step, isActive } = data || {};
      if (isActive) {
        if (step === "restart" || step === "success") {
          admin
            .firestore()
            .collection("clinic_bookings")
            .doc(id)
            .set(
              {
                isActive: false,
                updatedOn: new Date(),
              },
              { merge: true },
            )
            .catch((error: any) => throwError(error));
        }
        if (step === "success") await archiveClinicBooking(id);
        else if (step === "restart") await cancelClinicBooking(id, data);
      } else if (DEBUG)
        console.log(
          `CAN NOT UPDATE AN ARCHIVED (OR DELETED) CLINIC BOOKING: ${id}`,
          data,
        );
    }
    return true;
  });

import { admin, throwError } from "../../../config/config";

export const enforceOnlyOneActiveClinicBooking = (
  activeBookings: Array<any>,
): void => {
  activeBookings.map((bookingId: string, index: number) =>
    index !== 0
      ? admin
          .firestore()
          .collection("clinic_bookings")
          .doc(bookingId)
          .set({ isActive: false, updatedOn: new Date() }, { merge: true })
          .catch((error: any) => throwError(error))
      : admin
          .firestore()
          .collection("clinic_bookings")
          .doc(bookingId)
          .set({ isActive: true, updatedOn: new Date() }, { merge: true })
          .catch((error: any) => throwError(error)),
  );
};

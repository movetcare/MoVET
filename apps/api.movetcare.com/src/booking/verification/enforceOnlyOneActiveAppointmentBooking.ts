import {admin, throwError} from "../../config/config";

export const enforceOnlyOneActiveAppointmentBooking = (
  activeBookings: Array<any>
): void => {
  activeBookings.map((bookingId: string, index: number) =>
    index !== 0
      ? admin
          .firestore()
          .collection("bookings")
          .doc(bookingId)
          .set({ isActive: false, updatedOn: new Date() }, { merge: true })
          .catch((error: any) => throwError(error))
      : admin
          .firestore()
          .collection("bookings")
          .doc(bookingId)
          .set({ isActive: true, updatedOn: new Date() }, { merge: true })
          .catch((error: any) => throwError(error))
  );
};
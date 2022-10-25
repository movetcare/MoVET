import {admin, throwError} from "../../config/config";

export const enforceOnlyOneActiveAppointmentBooking = async (
  activeBookings: Array<any>
): Promise<any> =>
  activeBookings.map(async (bookingId: string, index: number) =>
    index !== 0
      ? await admin
          .firestore()
          .collection("bookings")
          .doc(bookingId)
          .set({isActive: false, updatedOn: new Date()}, {merge: true})
          .catch(async (error: any) => await throwError(error))
      : await admin
          .firestore()
          .collection("bookings")
          .doc(bookingId)
          .set({isActive: true, updatedOn: new Date()}, {merge: true})
          .catch(async (error: any) => await throwError(error))
  );

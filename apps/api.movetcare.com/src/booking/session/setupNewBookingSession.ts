import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type {
  BookingError,
  BookingResponse,
  Booking,
  PatientData,
} from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { getCustomerId } from "../../utils/getCustomerId";
import { handleFailedBooking } from "./handleFailedBooking";
import { getActiveBookingSession } from "../verification/getActiveBookingSession";
import { getAllActivePatients } from "./getAllActivePatients";
import { verifyClientInfo } from "./verifyClientInfo";

export const setupNewBookingSession = async ({
  email,
  device,
}: {
  email: string;
  device: string;
  token: string;
}): Promise<BookingError | BookingResponse> => {
  const isExistingClient = await verifyExistingClient(email);
  if (isExistingClient) {
    const authUser: UserRecord | null = await getAuthUserByEmail(email);
    if (authUser) {
      const booking: Booking | false = await getActiveBookingSession(
        authUser,
        device
      );
      const patients: Array<PatientData> | BookingError | any =
        await getAllActivePatients(authUser.uid);
      const customer: string = await getCustomerId(authUser.uid);
      const requiresInfo = await verifyClientInfo(authUser);
      if (patients && customer && booking) {
        return {
          patients,
          id: booking.id,
          client: { uid: authUser?.uid, requiresInfo },
        };
      } else
        await handleFailedBooking(
          { email, device, patients, customer },
          "FAILED TO GET DATA"
        );
    } else {
      return await handleFailedBooking(
        { email, device },
        "FAILED TO GET AUTH USER"
      );
    }
  }
  // Check that auth user ID exists as client ID in Provet
  // Check that auth user ID exists as clientId meta on Stripe
  // If existing client - Get all client info and all patient info and write to booking document
  return await handleFailedBooking(
    { email, device },
    "FAILED SETUP NEW BOOKING SESSION"
  );
};

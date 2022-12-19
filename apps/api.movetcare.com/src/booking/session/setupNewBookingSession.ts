import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type { BookingError, BookingResponse } from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { handleFailedBooking } from "./handleFailedBooking";
import { getActiveBookingSession } from "../verification/getActiveBookingSession";
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
      const session: BookingResponse | false = await getActiveBookingSession(
        authUser,
        device
      );
      const requiresInfo = await verifyClientInfo(authUser);
      if (session) {
        return {
          ...session,
          client: { uid: authUser?.uid, requiresInfo },
        };
      } else await handleFailedBooking({ email, device }, "FAILED TO GET DATA");
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

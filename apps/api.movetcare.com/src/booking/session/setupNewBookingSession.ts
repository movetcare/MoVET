import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type { BookingError, Booking } from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { handleFailedBooking } from "./handleFailedBooking";
import { getActiveBookingSession } from "../verification/getActiveBookingSession";
import { verifyClientDataExists } from "../../utils/auth/verifyClientDataExists";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";

export const setupNewBookingSession = async ({
  email,
  device,
}: {
  email: string;
  device: string;
  token: string;
}): Promise<BookingError | Booking> => {
  const isExistingClient = await verifyExistingClient(email);
  if (isExistingClient) return await startNewSession({ email, device });
  else {
    const proVetClientData: any = await createProVetClient({
      email,
      zip_code: null,
    });
    if (proVetClientData) {
      const didCreateNewClient = await createAuthClient({
        ...proVetClientData,
        password: null,
      });
      if (didCreateNewClient) return await startNewSession({ email, device });
      else
        return await handleFailedBooking(
          { email, device },
          "FAILED CREATE CLIENT"
        );
    } else
      return await handleFailedBooking(
        { email, device },
        "FAILED CREATE NEW CLIENT"
      );
  }
};

const startNewSession = async ({
  email,
  device,
}: {
  email: string;
  device: string;
}): Promise<BookingError | Booking> => {
  const authUser: UserRecord | null = await getAuthUserByEmail(email);
  if (authUser) {
    const session: Booking | false = await getActiveBookingSession(
      authUser,
      device
    );
    const requiresInfo = await verifyClientDataExists(authUser);
    if (session) {
      return {
        ...session,
        client: { uid: authUser?.uid, requiresInfo },
      };
    } else
      return await handleFailedBooking({ email, device }, "FAILED TO GET DATA");
  } else {
    return await handleFailedBooking(
      { email, device },
      "FAILED TO GET AUTH USER"
    );
  }
};
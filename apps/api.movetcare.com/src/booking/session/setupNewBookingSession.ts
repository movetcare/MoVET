import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type {
  BookingError,
  Booking,
  PatientBookingData,
} from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { handleFailedBooking } from "./handleFailedBooking";
import { getActiveBookingSession } from "../verification/getActiveBookingSession";
import { verifyClientDataExists } from "../../utils/auth/verifyClientDataExists";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";
import { getAllActivePatients } from "../../utils/getAllActivePatients";
import { DEBUG } from "../../config/config";

export const setupNewBookingSession = async ({
  email,
  device,
}: {
  email: string;
  device: string;
  token: string;
}): Promise<BookingError | Booking> => {
  const isExistingClient = await verifyExistingClient(email);
  if (isExistingClient) {
    if (DEBUG)
      console.log(
        "setupNewBookingSession => isExistingClient => startNewSession",
        email
      );
    return await startNewSession({ email, device, isExistingClient });
  } else {
    if (DEBUG) console.log("setupNewBookingSession => createNewClient", email);
    const proVetClientData: any = await createProVetClient({
      email,
      zip_code: null,
    });
    if (proVetClientData) {
      const didCreateNewClient = await createAuthClient({
        ...proVetClientData,
        password: null,
      });
      if (didCreateNewClient)
        return await startNewSession({ email, device, isExistingClient });
      else
        return await handleFailedBooking(
          { email, device },
          "FAILED CREATE CLIENT"
        );
    } else
      return await handleFailedBooking(
        { email, device },
        "CREATE NEW CLIENT FAILED"
      );
  }
};

const startNewSession = async ({
  email,
  device,
  isExistingClient,
}: {
  email: string;
  device: string;
  isExistingClient: boolean | null;
}): Promise<BookingError | Booking> => {
  const authUser: UserRecord | null = await getAuthUserByEmail(email);
  if (authUser) {
    const session: Booking | false = await getActiveBookingSession(
      authUser,
      device
    );
    const requiresInfo = await verifyClientDataExists(authUser);
    const patients: Array<PatientBookingData> | BookingError | any =
      await getAllActivePatients(authUser?.uid);
    if (session && patients) {
      return {
        ...session,
        patients,
        client: { uid: authUser?.uid, requiresInfo, isExistingClient },
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

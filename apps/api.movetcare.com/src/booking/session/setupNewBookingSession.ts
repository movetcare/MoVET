import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type {
  BookingError,
  Booking,
  PatientBookingData,
} from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { handleFailedBooking } from "./handleFailedBooking";
import { getActiveBookingSession } from "../verification/getActiveBookingSession";
import { verifyClientDataExists } from "../../utils/auth/verifyClientDataExists";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";
import { getAllActivePatients } from "../../utils/getAllActivePatients";
import { admin, throwError } from "../../config/config";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
const DEBUG = true;
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
    return await startNewSession({ email, device });
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
      if (didCreateNewClient) return await startNewSession({ email, device });
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
    const patients: Array<PatientBookingData> | BookingError | any =
      await getAllActivePatients(authUser?.uid);
    if (session && patients) {
      return {
        ...session,
        patients,
        client: {
          uid: authUser?.uid,
          requiresInfo,
          isExistingClient: await admin
            .firestore()
            .collection("appointments")
            .where("client", "==", Number(authUser?.uid))
            .where("active", "==", 0)
            .get()
            .then((docs: any) => {
              if (DEBUG)
                console.log("Closed Appointments - docs.size", docs.size);
              if (docs.size > 0) {
                return true;
              } else {
                return false;
              }
            })
            .catch((error: any) => {
              throwError(error);
              return null;
            }),
        },
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

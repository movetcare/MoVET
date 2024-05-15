import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, throwError } from "../../../config/config";
import { createAuthClient } from "../../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../../integrations/provet/entities/client/createProVetClient";
import { getAuthUserByEmail } from "../../../utils/auth/getAuthUserByEmail";
import { verifyClientDataExists } from "../../../utils/auth/verifyClientDataExists";
import { verifyExistingClient } from "../../../utils/auth/verifyExistingClient";
import { getAllActivePatients } from "../../../utils/getAllActivePatients";
import { handleFailedBooking } from "../../session/handleFailedBooking";
import type {
  BookingError,
  ClinicBooking,
  PatientBookingData,
} from "../../../types/booking";
import { getActiveClinicBookingSession } from "../verification/getActiveClinicBookingSession";

const DEBUG = false;
export const setupNewClinicBookingSession = async ({
  clinic,
  email,
  device,
}: {
  clinic: ClinicBooking["clinic"];
  email: string;
  device: string;
  token: string;
}): Promise<any> => {
  const isExistingClient = await verifyExistingClient(email);
  if (isExistingClient) {
    if (DEBUG)
      console.log(
        "setupNewClinicBookingSession => isExistingClient => startNewSession",
        email,
      );
    return await startNewSession({ clinic, email, device });
  } else {
    if (DEBUG)
      console.log("setupNewClinicBookingSession => createNewClient", email);
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
        return await startNewSession({ clinic, email, device });
      else
        return await handleFailedBooking(
          { email, device },
          "FAILED CREATE CLIENT",
        );
    } else
      return await handleFailedBooking(
        { email, device },
        "CREATE NEW CLIENT FAILED",
      );
  }
};

const startNewSession = async ({
  clinic,
  email,
  device,
}: {
  clinic: ClinicBooking["clinic"];
  email: string;
  device: string;
}): Promise<ClinicBooking | BookingError> => {
  const authUser: UserRecord | null = await getAuthUserByEmail(email);
  if (authUser) {
    const session: ClinicBooking | false = await getActiveClinicBookingSession(
      clinic,
      authUser,
      device,
    );
    const requiresInfo = await verifyClientDataExists(authUser);
    const patients: Array<PatientBookingData> | any | any =
      await getAllActivePatients(authUser?.uid);
    if (session && patients) {
      return {
        ...session,
        clinic,
        patients,
        client: {
          uid: authUser?.uid,
          requiresInfo,
          isExistingClient: await admin
            .firestore()
            .collection("appointments")
            .where("client", "==", Number(authUser?.uid))
            .where("active", "==", 1)
            .where("start", "<=", new Date())
            .get()
            .then((docs: any) => {
              if (DEBUG)
                console.log("Past Appointments - docs.size", docs.size);
              if (docs.size > 0) return true;
              else return false;
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
      "FAILED TO GET AUTH USER",
    );
  }
};

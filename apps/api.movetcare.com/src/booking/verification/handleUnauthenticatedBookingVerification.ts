import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { handleFailedBooking } from "../session/handleFailedBooking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { admin, DEBUG } from "../../config/config";
import { getActiveBookingSession } from "./getActiveBookingSession";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";
import type { Booking, BookingError } from "../../types/booking";

export const handleUnauthenticatedBookingVerification = async (
  email: string,
  device: string,
): Promise<Booking | Booking | BookingError | false> => {
  if (DEBUG)
    console.log(
      "handleUnauthenticatedBookingVerification => FETCHING USER DETAILS FOR: ",
      email,
    );
  const isNewClient = await admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord: any) => {
      if (DEBUG) console.log(userRecord);
      return false;
    })
    .catch((error: any) => {
      if (DEBUG) console.log(error.code);
      if (error.code === "auth/user-not-found") return true;
      else return false;
    });
  if (DEBUG)
    console.log(
      "handleUnauthenticatedBookingVerification => isNewClient",
      isNewClient,
    );
  if (isNewClient) {
    const proVetClientData: any = await createProVetClient({
      email,
      zip_code: null,
      firstname: undefined,
      lastname: undefined,
    });
    if (DEBUG)
      console.log(
        "handleUnauthenticatedBookingVerification => proVetClientData",
        proVetClientData,
      );
    if (proVetClientData) {
      const didCreateNewClient = await createAuthClient(
        proVetClientData,
        null,
        false,
      );
      if (didCreateNewClient)
        return {
          ...((await getActiveBookingSession(
            (await getAuthUserByEmail(email)) as UserRecord,
            device,
          )) as Booking),
        };
    }
    return await handleFailedBooking(
      {
        email,
      },
      "BOOKING FAILED: COULD NOT CREATE NEW CLIENT",
    );
  } else {
    const authUser = await getAuthUserByEmail(email);
    if (DEBUG) console.log(`${email}'s USER ID = ${authUser?.uid}`);
    if (authUser && authUser.disabled) {
      return await handleFailedBooking(
        {
          email,
        },
        "BOOKING FAILED: CLIENT DISABLED",
      );
    }
    return await getActiveBookingSession(authUser as UserRecord, device);
  }
};

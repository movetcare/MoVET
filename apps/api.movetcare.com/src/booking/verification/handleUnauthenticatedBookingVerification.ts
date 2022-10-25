import {handleFailedBooking} from "../handleFailedBooking";
import {getAuthUserByEmail} from "./../../utils/auth/getAuthUserByEmail";
import {admin} from "../../config/config";
import {getActiveBookingSession} from "./getActiveBookingSession";
import {createAuthClient} from "../../integrations/provet/entities/client/createAuthClient";
import {createProVetClient} from "../../integrations/provet/entities/client/createProVetClient";
const DEBUG = true;
export const handleUnauthenticatedBookingVerification = async (
  email: string
): Promise<Booking | BookingError | false> => {
  if (DEBUG)
    console.log(
      "handleUnauthenticatedBookingVerification => FETCHING USER DETAILS FOR: ",
      email
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
      isNewClient
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
        proVetClientData
      );
    if (proVetClientData) {
      const didCreateNewClient = await createAuthClient(proVetClientData);
      if (didCreateNewClient)
        return {
          isNewClient: true,
          ...((await getActiveBookingSession(
            await getAuthUserByEmail(email)
          )) as Booking),
        };
    }
    return await handleFailedBooking(
      {
        email,
      },
      "BOOKING FAILED: COULD NOT CREATE NEW CLIENT"
    );
  } else {
    const authUser = await getAuthUserByEmail(email);
    if (DEBUG) console.log(`${email}'s USER ID = ${authUser?.uid}`);
    if (authUser.disabled) {
      return await handleFailedBooking(
        {
          email,
        },
        "BOOKING FAILED: CLIENT DISABLED"
      );
    }
    return await getActiveBookingSession(authUser);
  }
};

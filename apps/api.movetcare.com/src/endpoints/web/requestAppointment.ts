import { handleFailedBooking } from "../../booking/session/handleFailedBooking";
import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
} from "../../config/config";
import { updateProVetClient } from "../../integrations/provet/entities/client/updateProVetClient";
import type { BookingError } from "../../types/booking";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
const DEBUG = false;
export const requestAppointment = functions
  .runWith({ ...defaultRuntimeOptions, memory: "4GB" })
  .https.onCall(async (data: any): Promise<true | BookingError> => {
    if (DEBUG)
      console.log(
        "requestAppointment => INCOMING REQUEST PAYLOAD requestAppointment => ",
        data,
      );
    const { token, id, firstName, lastName, phone, email, saveInfo } = data;
    if (token) {
      if (await recaptchaIsVerified(token)) {
        if (id && saveInfo && phone && email) {
          await updateProVetClient({
            firstName: firstName || "",
            lastName: lastName || "",
            phone: phone,
            id: ((await getAuthUserByEmail(email)) as any)?.uid,
          });
          return await admin
            .firestore()
            .collection("bookings")
            .doc(id)
            .set(
              {
                ...data,
                updatedOn: new Date(),
                isActive: true,
              },
              { merge: true },
            )
            .then(() => true)
            .catch((error: any) => {
              throwError(error);
              return handleFailedBooking(
                data,
                error?.message || "PROCESSING FAILED",
              );
            });
        } else if (id && phone && email) {
          await updateProVetClient({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            id: ((await getAuthUserByEmail(email)) as any)?.uid,
          });
          return await admin
            .firestore()
            .collection("bookings")
            .doc(id)
            .set(
              {
                ...data,
                updatedOn: new Date(),
                isActive: true,
                step: "success",
              },
              { merge: true },
            )
            .then(() => true)
            .catch((error: any) => {
              throwError(error);
              return handleFailedBooking(
                data,
                error?.message || "PROCESSING FAILED",
              );
            });
        } else return await handleFailedBooking(data, "FAILED TO GET SESSION");
      } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
    } else return await handleFailedBooking(data, "MISSING TOKEN");
  });

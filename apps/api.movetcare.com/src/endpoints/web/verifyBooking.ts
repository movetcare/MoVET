import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { functions, defaultRuntimeOptions, DEBUG } from "../../config/config";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";
import { handleFailedBooking } from "../../booking/handleFailedBooking";
import { handleUnauthenticatedBookingVerification } from "../../booking/verification/handleUnauthenticatedBookingVerification";
import { getActiveBookingSession } from "../../booking/verification/getActiveBookingSession";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import type { Booking, BookingError } from "../../types/booking";

export const verifyBooking = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: any,
      context: any
    ): Promise<Booking | BookingError | false> => {
      if (DEBUG) {
        console.log(
          "verifyBooking => INCOMING REQUEST PAYLOAD verifyBooking => ",
          data
        );
        console.log("verifyBooking => context.auth", context.auth);
      }
      const { token, email, device } = data || {};
      if (token) {
        if (await recaptchaIsVerified(token)) {
          if (context?.auth?.uid)
            return await getActiveBookingSession(
              (await getAuthUserByEmail(
                context.auth.token.email
              )) as UserRecord,
              device
            );
          else if (email) {
            return await handleUnauthenticatedBookingVerification(
              email?.toLowerCase(),
              device
            );
          } else
            return await handleFailedBooking(data, "FAILED AUTHENTICATION");
        } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
      } else return await handleFailedBooking(data, "MISSING TOKEN");
    }
  );

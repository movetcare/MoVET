import {functions, defaultRuntimeOptions} from "../../config/config";
import {recaptchaIsVerified} from "../../utils/recaptchaIsVerified";
import {handleFailedBooking} from "../../booking/handleFailedBooking";
import {handleUnauthenticatedBookingVerification} from "../../booking/verification/handleUnauthenticatedBookingVerification";
import {getActiveBookingSession} from "../../booking/verification/getActiveBookingSession";
import {getAuthUserByEmail} from "../../utils/auth/getAuthUserByEmail";
import type { Booking, BookingError } from "../../types/booking";
const DEBUG = true;
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
      const {token, email} = data || {};
      if (token) {
        if (await recaptchaIsVerified(token)) {
          if (context?.auth?.uid)
            return await getActiveBookingSession(
              await getAuthUserByEmail(context.auth.token.email)
            );
          else if (email) {
            return await handleUnauthenticatedBookingVerification(
              email?.toLowerCase()
            );
          } else
            return await handleFailedBooking(data, "FAILED AUTHENTICATION");
        } else return await handleFailedBooking(data, "FAILED TO PASS CAPTCHA");
      } else return await handleFailedBooking(data, "MISSING TOKEN");
    }
  );

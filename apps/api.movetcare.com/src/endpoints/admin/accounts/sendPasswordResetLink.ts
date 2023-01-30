import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  throwError,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import { sendWelcomeEmail } from "../../../notifications/templates/sendWelcomeEmail";
import { requestIsAuthorized } from "../pos/requestIsAuthorized";

export const sendPasswordResetLink = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({ email }: { email: string }, context: any): Promise<boolean> => {
      if (DEBUG) console.log("sendPasswordResetLink DATA =>", email);
      if (await requestIsAuthorized(context)) {
        try {
          await sendWelcomeEmail(email, true);
          sendNotification({
            type: "slack",
            payload: {
              message: `:key: Password Reset Email Sent via Admin App to ${email}`,
            },
          });
          return true;
        } catch (error) {
          throwError(error);
          return false;
        }
      } else return false;
    }
  );

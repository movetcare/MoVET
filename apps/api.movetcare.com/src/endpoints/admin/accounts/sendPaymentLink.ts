import { getClientFirstNameFromDisplayName } from "./../../../utils/getClientFirstNameFromDisplayName";
import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import type { EmailConfiguration } from "../../../types/email";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { requestIsAuthorized } from "../pos/requestIsAuthorized";

export const sendPaymentLink = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      { id, mode }: { id: string; mode: "SMS" | "EMAIL" },
      context: any,
    ): Promise<any | false> => {
      if (DEBUG) console.log("sendPaymentLink DATA =>", id);
      if (await requestIsAuthorized(context)) {
        const { email, displayName } = await getAuthUserById(id, [
          "email",
          "displayName",
        ]);
        if (mode === "EMAIL") {
          const emailConfigAdmin: EmailConfiguration = {
            to: email,
            subject: "Here is your MoVET Account Update Payment Link",
            message: `<p>Hi ${
              displayName
                ? getClientFirstNameFromDisplayName(displayName)
                : "there"
            }!</p><p>Here is the link you can use to updated your payment method on file with MoVET</p><p></p><p><a href="https://movetcare.com/payment?email=${email}">https://movetcare.com/payment?email=${email}</a></p><p></p><p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or chat with us via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>Thanks!</p><p>- The MoVET Team</p>`,
          };
          sendNotification({
            type: "email",
            payload: {
              ...emailConfigAdmin,
              client: id,
            },
          });
          return true;
        } else if (mode === "SMS") {
          sendNotification({
            type: "sms",
            payload: {
              client: id,
              message: `Hi ${
                displayName
                  ? getClientFirstNameFromDisplayName(displayName)
                  : "there"
              }!\n\nHere is the link you can use to updated your payment method on file with MoVET\n\nhttps://movetcare.com/payment?email=${email}\n\nPlease text us (@ 720-507-7387), email us (@ info@movetcare.com), or chat with us via our mobile app if you have any questions or need assistance!\n\nThanks!\n- The MoVET Team\n\nhttps://movetcare.com/get-the-app`,
              subject: "Here is your MoVET Account Update Payment Link (SMS)",
            },
          });
          return true;
        }
      } else return false;
    },
  );

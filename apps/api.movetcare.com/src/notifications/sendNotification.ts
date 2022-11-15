import type { EmailConfiguration } from "./../../../../packages/types/src/email";
import { emailClient, environment, throwError } from "../config/config";
import { findSlackChannel } from "../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../utils/logging/sendSlackMessage";

const DEBUG = false;
export const sendNotification = async ({
  type,
  payload,
}: {
  type: "slack" | "email" | "sms" | "push";
  payload: any;
}): Promise<void> => {
  if (DEBUG) {
    console.log(
      `sendNotification => NOTIFICATION OF TYPE "${type.toUpperCase()}" TRIGGERED`
    );
    console.log("sendNotification => PAYLOAD", payload);
  }
  switch (type) {
    case "slack":
      if (payload) {
        const channelId: any = await findSlackChannel(
          environment.type === "production" && payload?.channel
            ? payload?.channel
            : environment.type === "production"
            ? "production-logs"
            : "development-feed"
        );
        if (DEBUG) console.log("sendNotification => channelId", channelId);
        if (Array.isArray(payload?.message))
          sendSlackMessage(channelId, null, payload?.message);
        else if (payload?.message !== null)
          sendSlackMessage(channelId, payload?.message);
      }
      break;
    case "email":
      // eslint-disable-next-line no-case-declarations
      const emailConfig: EmailConfiguration = {
        to: payload?.to || "info@movetcare.com",
        from: payload?.from || "info@movetcare.com",
        bcc: payload?.bcc || "support@movetcare.com",
        replyTo: payload?.replyTo || "info@movetcare.com",
        subject: payload?.subject || "WHOOPS! Something Went Wrong...",
        text: payload?.message?.replace(/(<([^>]+)>)/gi, ""),
        html: payload?.message,
      };
      if (DEBUG) console.log("emailConfig =>", emailConfig);
      if (payload && environment?.type === "production")
        emailClient
          .send(emailConfig)
          .then(() => {
            if (DEBUG) console.log("EMAIL SENT!", emailConfig);
          })
          .catch((error: any) => throwError(error));
      else console.log("sendNotification => SIMULATED EMAIL:", emailConfig);
      break;
    default:
      break;
  }
};

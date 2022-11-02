import type { EmailConfiguration } from "./../../../../packages/types/src/email";
import { environment, emailClient, throwError } from "../config/config";
import { findSlackChannel } from "../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../utils/logging/sendSlackMessage";
import { getPayloadSummary } from "../utils/logging/getPayloadSummary";
const DEBUG = true;
export const sendNotification = async ({
  type,
  payload,
}: {
  type: "slack" | "email" | "sms" | "push";
  payload: any;
}): Promise<void> => {
  if (DEBUG) {
    console.log(
      `sendNotifications => NOTIFICATION OF TYPE "${type.toUpperCase()}" TRIGGERED`
    );
    console.log("sendNotifications => PAYLOAD", payload);
  }
  switch (type) {
    case "slack":
      if (payload) {
        if (DEBUG) console.log("payload?.channel", payload?.channel);
        const channelId: any = await findSlackChannel(
          payload?.channel ||
            (environment.type === "production"
              ? "production-logs"
              : "development-feed")
        );
        if (DEBUG) console.log("sendNotifications => channelId", channelId);
        if (Array.isArray(payload?.data?.message)) {
          await sendSlackMessage(channelId, null, payload?.data?.message).then(
            () =>
              DEBUG &&
              console.log(
                `sendNotifications => SLACK MESSAGE SENT:"${JSON.stringify(
                  payload?.data?.message
                )}"`
              )
          );
        } else {
          const message = await getPayloadSummary(payload);
          if (message !== null) {
            await sendSlackMessage(channelId, message).then(
              () =>
                DEBUG &&
                console.log(
                  `sendNotifications => SLACK MESSAGE SENT:"${message}"`
                )
            );
          }
        }
      } else
        console.log(
          `sendNotifications => SIMULATED SLACK MESSAGE:"${JSON.stringify(
            payload
          )}"`
        );
      break;
    case "email":
      // eslint-disable-next-line no-case-declarations
      const emailConfig: EmailConfiguration = {
        to: payload?.to || "info@movetcare.com",
        from: payload?.from || "info@movetcare.com",
        bcc: payload?.bcc || "support@movetcare.com",
        replyTo: payload?.replyTo || "info@movetcare.com",
        subject: payload?.subject || "UNKNOWN SYSTEM EMAIL",
        text: payload?.message?.replace(/(<([^>]+)>)/gi, ""),
        html: payload?.message,
      };
      if (DEBUG) console.log("emailConfig =>", emailConfig);
      if (environment?.type === "production")
        await emailClient
          .send(emailConfig)
          .then(async () => {
            if (DEBUG) console.log("EMAIL SENT!", emailConfig);
          })
          .catch(async (error: any) => {
            if (DEBUG) console.error(error?.response?.body?.errors);
            await throwError(error);
          });
      else if (DEBUG) console.log("SIMULATED SENDING EMAIL", emailConfig);
      break;
    default:
      break;
  }
};

import {environment, DEBUG} from "./../config/config";
import {findSlackChannel} from "./../utils/logging/findSlackChannel";
import {sendSlackMessage} from "../utils/logging/sendSlackMessage";
import {getPayloadSummary} from "../utils/logging/getPayloadSummary";

export const sendNotifications = async ({
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
        const channelId: any = await findSlackChannel(
          environment.type === "production"
            ? "production-logs"
            : "development-feed"
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
    default:
      break;
  }
};

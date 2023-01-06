import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request, DEBUG } from "../config/config";

export const handleAnnouncementBannerUpdate = functions.firestore
  .document("alerts/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleAnnouncementBannerUpdate => DATA", {
        id,
        data,
      });
    if (id === "banner") {
      const { isActive, isActiveMobile, link, message, title } = data || {};
      // https://vercel.com/docs/concepts/git/deploy-hooks
      const didTriggerVercelBuildWebhook =
        isActive && environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false"
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false =>",
                    data
                  );
                return status !== 200 && status !== 201 ? "ERROR" : data;
              })
              .catch(() => false)
          : false;

      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: ":loudspeaker: _Announcement Banner Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*TITLE:*",
                },
                {
                  type: "plain_text",
                  text: title,
                },
                {
                  type: "mrkdwn",
                  text: "*MESSAGE:*",
                },
                {
                  type: "plain_text",
                  text: message,
                },
                {
                  type: "mrkdwn",
                  text: "*LINK*",
                },
                {
                  type: "plain_text",
                  text: `https://movetcare.com${link}`,
                },
                {
                  type: "mrkdwn",
                  text: "*IS ACTIVE:*",
                },
                {
                  type: "plain_text",
                  text:
                    (isActive
                      ? "WEB: :white_check_mark: "
                      : "WEB: :red_circle:") +
                    " | " +
                    (isActiveMobile
                      ? "MOBILE: :white_check_mark: "
                      : "MOBILE: :red_circle:"),
                },
                {
                  type: "mrkdwn",
                  text: "*BUILD TRIGGERED:*",
                },
                {
                  type: "plain_text",
                  text: didTriggerVercelBuildWebhook
                    ? ":white_check_mark:"
                    : ":red_circle:",
                },
              ],
            },
          ],
        },
      });
    }
    return true;
  });

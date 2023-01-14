import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request, DEBUG } from "../config/config";

export const handleWinterModeUpdate = functions.firestore
  .document("configuration/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleWinterModeUpdate => DATA", {
        id,
        data,
      });
    if (id === "bookings") {
      const {
        isActiveOnWebsite,
        isActiveOnMobileApp,
        isActiveOnWebApp,
        message,
        startDate,
        endDate,
      } = data || {};
      // https://vercel.com/docs/concepts/git/deploy-hooks
      const didTriggerVercelBuildWebhook =
        isActiveOnWebsite && environment.type === "production"
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
                text: ":snowflake: _Winter Mode Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*START & END DATE:*",
                },
                {
                  type: "plain_text",
                  text: `${startDate?.toDate?.toString()} - ${endDate?.toDate?.toString()}`,
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
                  text: "*ACTIVE ON:*",
                },
                {
                  type: "plain_text",
                  text:
                    (isActiveOnWebsite
                      ? "WEBSITE: :white_check_mark: "
                      : "WEBSITE: :red_circle:") +
                    " | " +
                    (isActiveOnWebApp
                      ? "WEB APP: :white_check_mark: "
                      : "WEB APP: :red_circle:") +
                    " | " +
                    (isActiveOnMobileApp
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
